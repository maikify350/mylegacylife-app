-- Questions Seed Data
-- Run this after the clean_reset migration to populate questions

-- This file should contain your master questions
-- Format: INSERT INTO public.questions (question_text, category, order_index) VALUES

-- Example questions (replace with your actual questions):
INSERT INTO public.questions (question_text, category, order_index, is_active) VALUES
('What is your full name and date of birth?', 'Childhood & Family', 1, true),
('Where were you born?', 'Childhood & Family', 2, true),
('Who were your parents and what were they like?', 'Childhood & Family', 3, true),
('Did you have any siblings? Tell me about them.', 'Childhood & Family', 4, true),
('What is your earliest childhood memory?', 'Childhood & Family', 5, true),

('Where did you go to school?', 'Education & Career', 10, true),
('What was your favorite subject in school?', 'Education & Career', 11, true),
('What was your first job?', 'Education & Career', 12, true),
('What career path did you follow?', 'Education & Career', 13, true),

('When did you meet your spouse/partner?', 'Relationships & Love', 20, true),
('Tell me about your wedding day.', 'Relationships & Love', 21, true),
('Who was your best friend growing up?', 'Relationships & Love', 22, true),

('What is your proudest achievement?', 'Achievements & Milestones', 30, true),
('What major life events shaped who you are?', 'Achievements & Milestones', 31, true),

('What was the biggest challenge you overcame?', 'Challenges & Growth', 40, true),
('What lesson took you the longest to learn?', 'Challenges & Growth', 41, true),

('What hobbies or activities bring you joy?', 'Hobbies & Interests', 50, true),
('What is your favorite book/movie/song?', 'Hobbies & Interests', 51, true),

('What is the most memorable place you''ve visited?', 'Travel & Adventure', 60, true),
('What adventure would you still like to have?', 'Travel & Adventure', 61, true),

('What values are most important to you?', 'Values & Beliefs', 70, true),
('What do you believe happens after we die?', 'Values & Beliefs', 71, true),

('What advice would you give to future generations?', 'Legacy & Wisdom', 80, true),
('What do you want to be remembered for?', 'Legacy & Wisdom', 81, true);

-- TODO: Replace the above with your actual questions from the database
-- To export your current questions, run this query in Supabase:
-- SELECT 
--   'INSERT INTO public.questions (question_text, category, order_index, is_active) VALUES (''' || 
--   REPLACE(question_text, '''', '''''') || ''', ''' || 
--   COALESCE(category, 'Other') || ''', ' || 
--   COALESCE(order_index::text, '0') || ', ' || 
--   COALESCE(is_active::text, 'true') || ');'
-- FROM public.questions 
-- ORDER BY order_index;
