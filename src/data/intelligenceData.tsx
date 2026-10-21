import type { LucideIcon } from "lucide-react";
import {
  Building2, Eye, Users, Landmark, Globe2, Package, Cpu, Handshake, Swords, Target, Leaf,
  HeartHandshake, Newspaper, BarChart3, ShieldAlert, MapPin, ShieldCheck, GraduationCap,
  Award, Gift, Star, Contact,
} from "lucide-react";

export interface IntelligenceField {
  key: string;
  label: string;
  value?: string | undefined;
}
export interface IntelligenceSection {
  id: string;
  title: string;
  icon: LucideIcon;
  fields: IntelligenceField[];
}

type Def = [title: string, icon: LucideIcon, fields: [string, string][]];

const DEFS: Def[] = [
  ["Company Identity", Building2, [["name", "Legal Name"], ["short_name", "Short Name"], ["category", "Category"], ["nature_of_company", "Nature of Company"], ["incorporation_year", "Incorporation Year"], ["employee_size", "Employee Size"], ["headquarters_address", "Headquarters"]]],
  ["Overview & Vision", Eye, [["overview_text", "Overview"], ["vision_statement", "Vision"], ["mission_statement", "Mission"], ["core_values", "Core Values"], ["history_timeline", "History & Timeline"], ["strategic_priorities", "Strategic Priorities"]]],
  ["Leadership", Users, [["ceo_name", "CEO"], ["ceo_linkedin_url", "CEO LinkedIn"], ["key_leaders", "Key Leaders"], ["board_members", "Board Members"], ["warm_intro_pathways", "Warm Intro Pathways"], ["decision_maker_access", "Decision-Maker Access"]]],
  ["Funding & Financials", Landmark, [["annual_revenue", "Annual Revenue"], ["annual_profit", "Annual Profit"], ["revenue_mix", "Revenue Mix"], ["valuation", "Valuation"], ["yoy_growth_rate", "YoY Growth"], ["profitability_status", "Profitability"], ["key_investors", "Key Investors"], ["recent_funding_rounds", "Recent Funding"], ["total_capital_raised", "Total Capital Raised"], ["burn_rate", "Burn Rate"], ["runway_months", "Runway"], ["burn_multiplier", "Burn Multiplier"]]],
  ["Global Presence", Globe2, [["operating_countries", "Operating Countries"], ["office_count", "Office Count"], ["office_locations", "Office Locations"], ["global_exposure", "Global Exposure"]]],
  ["Products & Services", Package, [["offerings_description", "Offerings"], ["focus_sectors", "Focus Sectors"], ["pain_points_addressed", "Pain Points Addressed"], ["top_customers", "Top Customers"], ["case_studies", "Case Studies"], ["product_pipeline", "Product Pipeline"]]],
  ["Technology Stack", Cpu, [["tech_stack", "Tech Stack"], ["ai_ml_adoption_level", "AI/ML Adoption"], ["tech_adoption_rating", "Tech Adoption Rating"], ["intellectual_property", "Intellectual Property"], ["r_and_d_investment", "R&D Investment"], ["cybersecurity_posture", "Cybersecurity Posture"], ["innovation_roadmap", "Innovation Roadmap"], ["automation_level", "Automation Level"]]],
  ["Partnerships & Ecosystem", Handshake, [["technology_partners", "Technology Partners"], ["partnership_ecosystem", "Partnership Ecosystem"], ["industry_associations", "Industry Associations"], ["event_participation", "Event Participation"]]],
  ["Competitive Landscape", Swords, [["key_competitors", "Key Competitors"], ["competitive_advantages", "Competitive Advantages"], ["unique_differentiators", "Unique Differentiators"], ["weaknesses_gaps", "Weaknesses & Gaps"], ["benchmark_vs_peers", "Benchmark vs Peers"], ["market_share_percentage", "Market Share"]]],
  ["Market Opportunity", Target, [["tam", "TAM"], ["sam", "SAM"], ["som", "SOM"], ["future_projections", "Future Projections"], ["key_challenges_needs", "Key Challenges"], ["go_to_market_strategy", "Go-to-Market"]]],
  ["Core Value Proposition & ESG", Leaf, [["core_value_proposition", "Value Proposition"], ["esg_ratings", "ESG Ratings"], ["carbon_footprint", "Carbon Footprint"], ["ethical_sourcing", "Ethical Sourcing"], ["sustainability_csr", "Sustainability & CSR"]]],
  ["Culture & Work Life", HeartHandshake, [["work_culture_summary", "Work Culture"], ["manager_quality", "Manager Quality"], ["psychological_safety", "Psychological Safety"], ["feedback_culture", "Feedback Culture"], ["diversity_metrics", "Diversity Metrics"], ["diversity_inclusion_score", "Diversity & Inclusion"], ["ethical_standards", "Ethical Standards"], ["burnout_risk", "Burnout Risk"], ["mission_clarity", "Mission Clarity"], ["crisis_behavior", "Crisis Behavior"], ["layoff_history", "Layoff History"], ["employee_turnover", "Employee Turnover"], ["avg_retention_tenure", "Avg Retention Tenure"], ["hiring_velocity", "Hiring Velocity"]]],
  ["Recent News & Milestones", Newspaper, [["recent_news", "Recent News"], ["exit_strategy_history", "Exit Strategy History"]]],
  ["Sales & Customer Metrics", BarChart3, [["sales_motion", "Sales Motion"], ["customer_acquisition_cost", "CAC"], ["customer_lifetime_value", "LTV"], ["cac_ltv_ratio", "CAC:LTV"], ["churn_rate", "Churn Rate"], ["net_promoter_score", "NPS"], ["customer_concentration_risk", "Customer Concentration Risk"]]],
  ["Risk & Compliance", ShieldAlert, [["regulatory_status", "Regulatory Status"], ["legal_issues", "Legal Issues"], ["supply_chain_dependencies", "Supply-Chain Dependencies"], ["geopolitical_risks", "Geopolitical Risks"], ["macro_risks", "Macro Risks"]]],
  ["Work Location & Commute", MapPin, [["remote_policy_details", "Remote Policy"], ["flexibility_level", "Flexibility"], ["typical_hours", "Typical Hours"], ["overtime_expectations", "Overtime"], ["weekend_work", "Weekend Work"], ["location_centrality", "Location Centrality"], ["office_zone_type", "Office Zone"], ["public_transport_access", "Public Transport"], ["cab_policy", "Cab Policy"], ["airport_commute_time", "Airport Commute"]]],
  ["Safety & Wellbeing", ShieldCheck, [["area_safety", "Area Safety"], ["safety_policies", "Safety Policies"], ["infrastructure_safety", "Infrastructure Safety"], ["emergency_preparedness", "Emergency Preparedness"], ["health_support", "Health Support"]]],
  ["Career Growth & Learning", GraduationCap, [["training_spend", "Training Spend"], ["onboarding_quality", "Onboarding"], ["learning_culture", "Learning Culture"], ["mentorship_availability", "Mentorship"], ["internal_mobility", "Internal Mobility"], ["promotion_clarity", "Promotion Clarity"], ["tools_access", "Tools Access"], ["role_clarity", "Role Clarity"], ["early_ownership", "Early Ownership"], ["work_impact", "Work Impact"], ["execution_thinking_balance", "Execution vs Thinking"], ["cross_functional_exposure", "Cross-Functional Exposure"], ["exposure_quality", "Exposure Quality"], ["skill_relevance", "Skill Relevance"], ["exit_opportunities", "Exit Opportunities"], ["network_strength", "Network Strength"]]],
  ["Brand & Reputation", Award, [["brand_value", "Brand Value"], ["brand_sentiment_score", "Brand Sentiment"], ["awards_recognitions", "Awards"], ["external_recognition", "External Recognition"], ["customer_testimonials", "Testimonials"], ["client_quality", "Client Quality"], ["company_maturity", "Company Maturity"]]],
  ["Compensation & Benefits", Gift, [["fixed_vs_variable_pay", "Fixed vs Variable"], ["bonus_predictability", "Bonus Predictability"], ["esops_incentives", "ESOPs & Incentives"], ["leave_policy", "Leave Policy"], ["family_health_insurance", "Family Health Insurance"], ["relocation_support", "Relocation Support"], ["lifestyle_benefits", "Lifestyle Benefits"]]],
  ["Digital Presence & Ratings", Star, [["website_url", "Website"], ["website_quality", "Website Quality"], ["website_rating", "Website Rating"], ["website_traffic_rank", "Traffic Rank"], ["social_media_followers", "Social Followers"], ["glassdoor_rating", "Glassdoor"], ["indeed_rating", "Indeed"], ["google_rating", "Google"], ["marketing_video_url", "Marketing Video"], ["linkedin_url", "LinkedIn"], ["twitter_handle", "Twitter / X"], ["facebook_url", "Facebook"], ["instagram_url", "Instagram"]]],
  ["Contact Information", Contact, [["primary_contact_email", "Primary Email"], ["primary_phone_number", "Primary Phone"], ["contact_person_name", "Contact Person"], ["contact_person_title", "Contact Title"], ["contact_person_email", "Contact Email"], ["contact_person_phone", "Contact Phone"]]],
];

export function buildIntelligenceSections(profile?: Record<string, string>): IntelligenceSection[] {
  return DEFS.map(([title, icon, fields], i) => ({
    id: `section-${i}`,
    title,
    icon,
    fields: fields.map(([key, label]) => ({ key, label, value: profile?.[key] })),
  }));
}
