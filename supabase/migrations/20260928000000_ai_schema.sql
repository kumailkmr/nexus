-- AI Providers
CREATE TABLE ai_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- AI Models
CREATE TABLE ai_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES ai_providers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    media_type TEXT NOT NULL,
    capabilities JSONB,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Model Pricing
CREATE TABLE ai_model_pricing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_id UUID NOT NULL REFERENCES ai_models(id) ON DELETE CASCADE,
    currency TEXT NOT NULL DEFAULT 'USD',
    billing_type TEXT NOT NULL,
    base_cost NUMERIC(10, 4) DEFAULT 0,
    cost_per_second NUMERIC(10, 4) DEFAULT 0,
    cost_per_image NUMERIC(10, 4) DEFAULT 0,
    cost_per_generation NUMERIC(10, 4) DEFAULT 0,
    orientation TEXT,
    quality TEXT,
    active BOOLEAN NOT NULL DEFAULT true,
    effective_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    effective_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Generation Jobs
CREATE TABLE generation_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requested_by UUID NOT NULL REFERENCES auth.users(id),
    model_id UUID NOT NULL REFERENCES ai_models(id),
    media_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'QUEUED',
    prompt TEXT NOT NULL,
    request_parameters JSONB NOT NULL DEFAULT '{}',
    provider_job_id TEXT,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    failed_at TIMESTAMPTZ,
    error_code TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Generation Outputs
CREATE TABLE generation_outputs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    generation_id UUID NOT NULL REFERENCES generation_jobs(id) ON DELETE CASCADE,
    output_type TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    public_url TEXT,
    width INTEGER,
    height INTEGER,
    duration NUMERIC,
    mime_type TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Usage Records
CREATE TABLE usage_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES ai_providers(id),
    model_id UUID NOT NULL REFERENCES ai_models(id),
    generation_id UUID REFERENCES generation_jobs(id),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    media_type TEXT NOT NULL,
    units NUMERIC NOT NULL DEFAULT 1,
    duration NUMERIC,
    request_count INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Generation Costs
CREATE TABLE generation_costs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    generation_id UUID NOT NULL REFERENCES generation_jobs(id) ON DELETE CASCADE,
    model_id UUID NOT NULL REFERENCES ai_models(id),
    billing_units NUMERIC NOT NULL,
    unit_cost NUMERIC(10, 4) NOT NULL,
    total_cost NUMERIC(10, 4) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    pricing_reference UUID REFERENCES ai_model_pricing(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE ai_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_model_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE generation_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE generation_outputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE generation_costs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active providers" ON ai_providers FOR SELECT USING (status = 'active');
CREATE POLICY "Anyone can view active models" ON ai_models FOR SELECT USING (status = 'active');
CREATE POLICY "Anyone can view active pricing" ON ai_model_pricing FOR SELECT USING (active = true);
CREATE POLICY "Users can view own generation jobs" ON generation_jobs FOR SELECT USING (auth.uid() = requested_by);
CREATE POLICY "Users can create own generation jobs" ON generation_jobs FOR INSERT WITH CHECK (auth.uid() = requested_by);
CREATE POLICY "Users can view outputs for own jobs" ON generation_outputs FOR SELECT USING (
    EXISTS (SELECT 1 FROM generation_jobs WHERE id = generation_outputs.generation_id AND requested_by = auth.uid())
);
CREATE POLICY "Users can view own usage" ON usage_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own costs" ON generation_costs FOR SELECT USING (
    EXISTS (SELECT 1 FROM generation_jobs WHERE id = generation_costs.generation_id AND requested_by = auth.uid())
);

-- Create Storage bucket for outputs
INSERT INTO storage.buckets (id, name, public) VALUES ('generations', 'generations', true) ON CONFLICT DO NOTHING;

CREATE POLICY "Anyone can read generations" ON storage.objects FOR SELECT USING (bucket_id = 'generations');
CREATE POLICY "Authenticated users can insert generations" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'generations' AND auth.role() = 'authenticated');

-- Insert Initial Seed Data
INSERT INTO ai_providers (name, slug) VALUES 
('OpenAI', 'openai'),
('Higgsfield', 'higgsfield');

INSERT INTO ai_models (provider_id, name, slug, media_type, capabilities)
SELECT id, 'DALL-E 3', 'dall-e-3', 'image', '{"aspect_ratios": ["1:1", "16:9", "9:16"], "qualities": ["standard", "hd"]}'::jsonb
FROM ai_providers WHERE slug = 'openai';

INSERT INTO ai_models (provider_id, name, slug, media_type, capabilities)
SELECT id, 'Higgsfield Video', 'higgsfield-video-1', 'video', '{"durations": [5, 10, 15], "orientations": ["landscape", "portrait"]}'::jsonb
FROM ai_providers WHERE slug = 'higgsfield';

-- Simple default pricing
INSERT INTO ai_model_pricing (model_id, currency, billing_type, cost_per_image)
SELECT id, 'USD', 'per_image', 0.040
FROM ai_models WHERE slug = 'dall-e-3';

INSERT INTO ai_model_pricing (model_id, currency, billing_type, base_cost, cost_per_second)
SELECT id, 'USD', 'per_second', 0.10, 0.02
FROM ai_models WHERE slug = 'higgsfield-video-1';
