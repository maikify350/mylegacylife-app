-- Community Question Contributions Table
-- Stores user-contributed questions for review and approval

create table if not exists public.contributed_questions (
  id uuid primary key default gen_random_uuid(),
  
  -- Contributor Information
  contributor_email varchar(255) not null,
  contributor_phone varchar(50),
  subscriber_id uuid, -- Link to subscriber if logged in (no FK for now)
  
  -- Question Data
  question_text text not null,
  suggested_category varchar(100),
  assigned_category varchar(100),
  
  -- Status Workflow: submitted → accepted/rejected
  status varchar(50) not null default 'submitted' check (status in (
    'submitted',
    'accepted',
    'rejected'
  )),
  
  -- Rejection Tracking
  rejection_reason varchar(100) check (rejection_reason in (
    'duplicate',
    'inappropriate',
    'unclear',
    'too_specific',
    'too_general',
    'off_topic',
    'other'
  )),
  duplicate_of_question_id uuid, -- Link to existing question (no FK for now)
  similarity_score decimal(3,2),
  
  -- Reward Tracking
  reward_status varchar(50) default 'pending' check (reward_status in (
    'pending',
    'credited',
    'notified',
    'claimed',
    'expired'
  )),
  reward_amount decimal(10,2),
  reward_claimed_at timestamptz,
  
  -- Admin Review
  reviewed_by uuid, -- Admin who reviewed (no FK for now)
  reviewed_at timestamptz,
  admin_notes text,
  
  -- Metadata
  ip_address inet,
  user_agent text,
  
  -- Audit Fields (standard pattern)
  created_at timestamptz not null default now(),
  created_by uuid null,
  updated_at timestamptz not null default now(),
  updated_by uuid null
);

-- Indexes
create index if not exists idx_contributed_questions_email on public.contributed_questions(contributor_email);
create index if not exists idx_contributed_questions_status on public.contributed_questions(status) where status = 'submitted';
create index if not exists idx_contributed_questions_subscriber on public.contributed_questions(subscriber_id) where subscriber_id is not null;
create index if not exists idx_contributed_questions_created on public.contributed_questions(created_at desc);
create index if not exists idx_contributed_questions_reward on public.contributed_questions(reward_status) where reward_status in ('pending', 'notified');

-- Row Level Security
alter table public.contributed_questions enable row level security;

-- Anyone can insert (public contribution)
create policy "Anyone can contribute questions"
  on public.contributed_questions
  for insert
  with check (true);

-- Anyone can view (for now - will restrict later when subscribers table exists)
create policy "Anyone can view questions"
  on public.contributed_questions
  for select
  using (true);

-- Only authenticated users can update/delete (simplified for now)
create policy "Authenticated users can manage questions"
  on public.contributed_questions
  for all
  using (auth.uid() is not null);
