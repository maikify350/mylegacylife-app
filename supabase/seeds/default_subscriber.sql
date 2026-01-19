-- Seed default subscriber for testing
-- This creates Ricardo Garcia as the default test user

INSERT INTO public.subscribers (email, phone, full_name, status)
VALUES (
    'ricardo.garcia@mylegacylife.ai',
    NULL,
    'Ricardo Garcia',
    'active'
)
ON CONFLICT (email) DO NOTHING;

-- Get the subscriber ID for reference
-- You can query: SELECT id FROM subscribers WHERE email = 'ricardo.garcia@mylegacylife.ai';
