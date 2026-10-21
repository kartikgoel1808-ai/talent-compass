CREATE TABLE IF NOT EXISTS public.companies (
  company_id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.skill_set_master (
  skill_set_id SERIAL PRIMARY KEY,
  skill_set_name VARCHAR(100) NOT NULL UNIQUE,
  short_name VARCHAR(10) NOT NULL UNIQUE,
  skill_set_description TEXT
);
CREATE INDEX IF NOT EXISTS idx_skill_set_name ON public.skill_set_master(skill_set_name);
CREATE INDEX IF NOT EXISTS idx_skill_set_short_name ON public.skill_set_master(short_name);

CREATE TABLE IF NOT EXISTS public.proficiency_levels (
  proficiency_level_id INTEGER PRIMARY KEY CHECK (proficiency_level_id BETWEEN 1 AND 10),
  proficiency_name VARCHAR(50) NOT NULL,
  proficiency_code VARCHAR(5) NOT NULL,
  proficiency_description TEXT
);
CREATE INDEX IF NOT EXISTS idx_proficiency_code ON public.proficiency_levels(proficiency_code);

CREATE TABLE IF NOT EXISTS public.skill_set_topics (
  topic_id SERIAL PRIMARY KEY,
  skill_set_id INTEGER NOT NULL REFERENCES public.skill_set_master(skill_set_id) ON DELETE CASCADE,
  level_number INTEGER NOT NULL CHECK (level_number BETWEEN 1 AND 10),
  topics TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_topic_per_skill_level UNIQUE (skill_set_id, level_number, topics)
);
CREATE INDEX IF NOT EXISTS idx_skill_set_topics_skill ON public.skill_set_topics(skill_set_id);
CREATE INDEX IF NOT EXISTS idx_skill_set_topics_level ON public.skill_set_topics(level_number);

CREATE TABLE IF NOT EXISTS public.company_skill_levels (
  id SERIAL PRIMARY KEY,
  company_id INTEGER NOT NULL REFERENCES public.companies(company_id) ON DELETE CASCADE,
  skill_set_id INTEGER NOT NULL REFERENCES public.skill_set_master(skill_set_id) ON DELETE CASCADE,
  required_level INTEGER NOT NULL CHECK (required_level BETWEEN 1 AND 10),
  required_proficiency_level_id INTEGER NOT NULL REFERENCES public.proficiency_levels(proficiency_level_id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_company_skill UNIQUE (company_id, skill_set_id)
);
CREATE INDEX IF NOT EXISTS idx_company_skill_levels_company ON public.company_skill_levels(company_id);
CREATE INDEX IF NOT EXISTS idx_company_skill_levels_skill ON public.company_skill_levels(skill_set_id);

CREATE TABLE IF NOT EXISTS public.staging_skill_topics (
  id SERIAL PRIMARY KEY,
  skill_area TEXT NOT NULL,
  levels TEXT NOT NULL,
  topics TEXT NOT NULL,
  processed BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_staging_skill_topics_unprocessed ON public.staging_skill_topics(processed) WHERE processed = FALSE;

CREATE TABLE IF NOT EXISTS public.staging_company_skill_levels (
  id SERIAL PRIMARY KEY,
  companies TEXT NOT NULL,
  coding TEXT,
  data_structures_and_algorithms TEXT,
  object_oriented_programming_and_design TEXT,
  aptitude_and_problem_solving TEXT,
  communication_skills TEXT,
  ai_native_engineering TEXT,
  devops_and_cloud TEXT,
  sql_and_design TEXT,
  software_engineering TEXT,
  system_design_and_architecture TEXT,
  computer_networking TEXT,
  operating_system TEXT,
  processed BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_staging_company_skill_levels_unprocessed ON public.staging_company_skill_levels(processed) WHERE processed = FALSE;

-- Grants: reference data readable by everyone; writes only via backend/admin
GRANT SELECT ON public.companies, public.skill_set_master, public.proficiency_levels, public.skill_set_topics, public.company_skill_levels TO anon, authenticated;
GRANT ALL ON public.companies, public.skill_set_master, public.proficiency_levels, public.skill_set_topics, public.company_skill_levels, public.staging_skill_topics, public.staging_company_skill_levels TO service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_set_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proficiency_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_set_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_skill_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staging_skill_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staging_company_skill_levels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read companies" ON public.companies FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read skills" ON public.skill_set_master FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read proficiency" ON public.proficiency_levels FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read topics" ON public.skill_set_topics FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read company skills" ON public.company_skill_levels FOR SELECT TO anon, authenticated USING (true);

-- Functions
CREATE OR REPLACE FUNCTION public.parse_level_number(level_text TEXT)
RETURNS INTEGER LANGUAGE plpgsql IMMUTABLE SET search_path = public AS $$
DECLARE level_num INTEGER; cleaned_text TEXT;
BEGIN
  cleaned_text := TRIM(level_text);
  cleaned_text := REGEXP_REPLACE(cleaned_text, '^level\s*', '', 'i');
  cleaned_text := REGEXP_REPLACE(cleaned_text, '[^0-9]', '', 'g');
  IF cleaned_text IS NULL OR cleaned_text = '' THEN
    RAISE EXCEPTION 'Invalid level format: "%". Expected "Level X" or a number 1-10.', level_text;
  END IF;
  level_num := cleaned_text::INTEGER;
  IF level_num < 1 OR level_num > 10 THEN
    RAISE EXCEPTION 'Level must be between 1 and 10. Got: %', level_num;
  END IF;
  RETURN level_num;
END; $$;

CREATE OR REPLACE FUNCTION public.get_skill_set_id(skill_name TEXT)
RETURNS INTEGER LANGUAGE plpgsql STABLE SET search_path = public AS $$
DECLARE result_id INTEGER;
BEGIN
  SELECT skill_set_id INTO result_id FROM public.skill_set_master
  WHERE LOWER(TRIM(skill_set_name)) = LOWER(TRIM(skill_name));
  IF result_id IS NULL THEN RAISE EXCEPTION 'Skill area not found: "%"', skill_name; END IF;
  RETURN result_id;
END; $$;

-- Note: codes are shared by two levels (e.g. AP = 3 and 4); returns the lowest id
CREATE OR REPLACE FUNCTION public.get_proficiency_level_id(prof_code TEXT)
RETURNS INTEGER LANGUAGE plpgsql STABLE SET search_path = public AS $$
DECLARE result_id INTEGER;
BEGIN
  SELECT proficiency_level_id INTO result_id FROM public.proficiency_levels
  WHERE UPPER(TRIM(proficiency_code)) = UPPER(TRIM(prof_code))
  ORDER BY proficiency_level_id LIMIT 1;
  IF result_id IS NULL THEN RAISE EXCEPTION 'Proficiency code not found: "%"', prof_code; END IF;
  RETURN result_id;
END; $$;

CREATE OR REPLACE FUNCTION public.parse_skill_value(skill_value TEXT)
RETURNS TABLE(required_level INTEGER, proficiency_code TEXT)
LANGUAGE plpgsql IMMUTABLE SET search_path = public AS $$
DECLARE parts TEXT[]; cleaned_value TEXT;
BEGIN
  IF skill_value IS NULL OR TRIM(skill_value) = '' THEN RETURN; END IF;
  cleaned_value := REGEXP_REPLACE(TRIM(skill_value), '\s*[–—-]\s*', '-', 'g');
  parts := STRING_TO_ARRAY(cleaned_value, '-');
  IF COALESCE(array_length(parts, 1), 0) < 2 THEN
    RAISE EXCEPTION 'Invalid skill value format: "%". Expected "level-proficiency_code" (e.g., "5-AP")', skill_value;
  END IF;
  required_level := public.parse_level_number(TRIM(parts[1]));
  proficiency_code := TRIM(parts[2]);
  RETURN NEXT;
END; $$;

CREATE OR REPLACE FUNCTION public.get_or_create_company(company_name_input TEXT)
RETURNS INTEGER LANGUAGE plpgsql SET search_path = public AS $$
DECLARE result_id INTEGER;
BEGIN
  SELECT company_id INTO result_id FROM public.companies
  WHERE LOWER(TRIM(name)) = LOWER(TRIM(company_name_input));
  IF result_id IS NULL THEN
    INSERT INTO public.companies (name) VALUES (TRIM(company_name_input))
    RETURNING company_id INTO result_id;
  END IF;
  RETURN result_id;
END; $$;

CREATE OR REPLACE FUNCTION public.process_staging_skill_topics()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
DECLARE v_skill_set_id INTEGER; v_level_number INTEGER; v_topic TEXT;
BEGIN
  IF NEW.processed = TRUE THEN RETURN NEW; END IF;
  BEGIN
    v_skill_set_id := public.get_skill_set_id(NEW.skill_area);
    v_level_number := public.parse_level_number(NEW.levels);
    FOREACH v_topic IN ARRAY STRING_TO_ARRAY(NEW.topics, ';') LOOP
      v_topic := TRIM(v_topic);
      IF v_topic IS NOT NULL AND v_topic <> '' THEN
        INSERT INTO public.skill_set_topics (skill_set_id, level_number, topics)
        VALUES (v_skill_set_id, v_level_number, v_topic)
        ON CONFLICT (skill_set_id, level_number, topics) DO NOTHING;
      END IF;
    END LOOP;
    NEW.processed := TRUE; NEW.processed_at := NOW(); NEW.error_message := NULL;
  EXCEPTION WHEN OTHERS THEN
    NEW.processed := FALSE; NEW.error_message := SQLERRM;
  END;
  RETURN NEW;
END; $$;

CREATE OR REPLACE FUNCTION public.process_staging_company_skill_levels()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
DECLARE
  v_company_id INTEGER; v_skill_set_id INTEGER; v_required_level INTEGER;
  v_proficiency_code TEXT; v_proficiency_level_id INTEGER; m RECORD;
BEGIN
  IF NEW.processed = TRUE THEN RETURN NEW; END IF;
  BEGIN
    v_company_id := public.get_or_create_company(NEW.companies);
    FOR m IN
      SELECT skill_name, skill_value FROM (VALUES
        ('Coding', NEW.coding),
        ('Data Structures and Algorithms', NEW.data_structures_and_algorithms),
        ('Object-Oriented Programming and Design', NEW.object_oriented_programming_and_design),
        ('Aptitude and Problem Solving', NEW.aptitude_and_problem_solving),
        ('Communication Skills', NEW.communication_skills),
        ('AI Native Engineering', NEW.ai_native_engineering),
        ('DevOps and Cloud', NEW.devops_and_cloud),
        ('SQL and Design', NEW.sql_and_design),
        ('Software Engineering', NEW.software_engineering),
        ('System Design and Architecture', NEW.system_design_and_architecture),
        ('Computer Networking', NEW.computer_networking),
        ('Operating System', NEW.operating_system)
      ) AS t(skill_name, skill_value)
      WHERE skill_value IS NOT NULL AND TRIM(skill_value) <> ''
    LOOP
      v_skill_set_id := public.get_skill_set_id(m.skill_name);
      SELECT pv.required_level, pv.proficiency_code INTO v_required_level, v_proficiency_code
      FROM public.parse_skill_value(m.skill_value) pv;
      v_proficiency_level_id := public.get_proficiency_level_id(v_proficiency_code);
      INSERT INTO public.company_skill_levels (company_id, skill_set_id, required_level, required_proficiency_level_id)
      VALUES (v_company_id, v_skill_set_id, v_required_level, v_proficiency_level_id)
      ON CONFLICT (company_id, skill_set_id) DO UPDATE SET
        required_level = EXCLUDED.required_level,
        required_proficiency_level_id = EXCLUDED.required_proficiency_level_id;
    END LOOP;
    NEW.processed := TRUE; NEW.processed_at := NOW(); NEW.error_message := NULL;
  EXCEPTION WHEN OTHERS THEN
    NEW.processed := FALSE; NEW.error_message := SQLERRM;
  END;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_process_staging_skill_topics ON public.staging_skill_topics;
DROP TRIGGER IF EXISTS trg_process_staging_company_skill_levels ON public.staging_company_skill_levels;
CREATE TRIGGER trg_process_staging_skill_topics BEFORE INSERT ON public.staging_skill_topics
  FOR EACH ROW EXECUTE FUNCTION public.process_staging_skill_topics();
CREATE TRIGGER trg_process_staging_company_skill_levels BEFORE INSERT ON public.staging_company_skill_levels
  FOR EACH ROW EXECUTE FUNCTION public.process_staging_company_skill_levels();

-- Seed data
INSERT INTO public.skill_set_master (skill_set_id, skill_set_name, short_name, skill_set_description) VALUES
 (1, 'Coding', 'COD', 'The foundational ability to write clean, efficient, and functional code in one or more programming languages to implement software solutions.'),
 (2, 'Data Structures and Algorithms', 'DSA', 'Knowledge of fundamental data structures (arrays, trees, graphs, etc.) and algorithms (searching, sorting, traversal) to solve computational problems efficiently, with an understanding of time and space complexity.'),
 (3, 'Aptitude and Problem Solving', 'APTI', 'The capacity for logical reasoning, quantitative analysis, and breaking down complex, ambiguous problems into solvable components.'),
 (4, 'Communication Skills', 'COMM', 'The ability to articulate ideas clearly and concisely, both verbally and in writing, to collaborate effectively with team members, stakeholders, and clients.'),
 (5, 'Object-Oriented Programming and Design', 'OOD', 'Expertise in applying OOP principles (encapsulation, inheritance, polymorphism, abstraction) and design patterns to create modular, reusable, and maintainable software.'),
 (6, 'AI Native Engineering', 'AI', 'The practice of building software with AI as a core component, encompassing prompt engineering, integration of AI models (LLMs, ML), and developing applications that leverage generative AI and machine learning capabilities.'),
 (7, 'SQL and Design', 'SQL', 'Proficiency in writing and optimizing SQL queries, combined with the ability to design, normalize, and manage relational database schemas for data integrity and performance.'),
 (8, 'System Design and Architecture', 'SYSD', 'The skill of designing large-scale, scalable, reliable, and high-performance software systems, including defining components, their interactions, and selecting appropriate architectural patterns.'),
 (9, 'DevOps and Cloud', 'CLOUD', 'Knowledge of practices that combine software development and IT operations (CI/CD, IaC, monitoring) and experience with cloud platforms (AWS, Azure, GCP) for deploying and managing applications.'),
 (10, 'Software Engineering', 'SWE', 'A broad understanding of the full software development lifecycle (SDLC), including requirements analysis, design, implementation, testing, deployment, and maintenance, following engineering best practices.'),
 (11, 'Computer Networking', 'NETW', 'Understanding of network protocols (TCP/IP, HTTP, DNS), network architecture, and concepts related to data communication, routing, and security across distributed systems.'),
 (12, 'Operating System', 'OS', 'Knowledge of core operating system concepts such as process and thread management, memory management, file systems, concurrency, and system calls.')
ON CONFLICT (skill_set_id) DO UPDATE SET skill_set_name = EXCLUDED.skill_set_name, short_name = EXCLUDED.short_name, skill_set_description = EXCLUDED.skill_set_description;

SELECT setval('public.skill_set_master_skill_set_id_seq', (SELECT MAX(skill_set_id) FROM public.skill_set_master));

INSERT INTO public.proficiency_levels (proficiency_level_id, proficiency_name, proficiency_code, proficiency_description) VALUES
 (1, 'Conceptual Understanding', 'CU', 'Awareness and comprehension of fundamental facts, concepts, and terminology. The ability to recall or recognize ideas in a basic form.'),
 (2, 'Conceptual Understanding', 'CU', 'Awareness and comprehension of fundamental facts, concepts, and terminology. The ability to recall or recognize ideas in a basic form.'),
 (3, 'Application', 'AP', 'The ability to use learned knowledge, concepts, and techniques in new, concrete situations to solve straightforward problems.'),
 (4, 'Application', 'AP', 'The ability to use learned knowledge, concepts, and techniques in new, concrete situations to solve straightforward problems.'),
 (5, 'Analysis and Synthesis', 'AS', 'The capacity to deconstruct complex information into constituent parts, understand their relationships, and combine elements to form a new, coherent whole.'),
 (6, 'Analysis and Synthesis', 'AS', 'The capacity to deconstruct complex information into constituent parts, understand their relationships, and combine elements to form a new, coherent whole.'),
 (7, 'Evaluation', 'EV', 'The ability to make judgments, critique, and defend opinions based on criteria and standards through logical examination and comparison.'),
 (8, 'Evaluation', 'EV', 'The ability to make judgments, critique, and defend opinions based on criteria and standards through logical examination and comparison.'),
 (9, 'Creation', 'CR', 'The skill to generate, design, or construct original work, solutions, or processes by planning, producing, and integrating novel ideas.'),
 (10, 'Creation', 'CR', 'The skill to generate, design, or construct original work, solutions, or processes by planning, producing, and integrating novel ideas.')
ON CONFLICT (proficiency_level_id) DO UPDATE SET proficiency_name = EXCLUDED.proficiency_name, proficiency_code = EXCLUDED.proficiency_code, proficiency_description = EXCLUDED.proficiency_description;