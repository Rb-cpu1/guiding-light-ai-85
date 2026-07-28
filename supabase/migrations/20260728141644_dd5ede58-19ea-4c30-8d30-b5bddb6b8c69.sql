
-- 1. Threads table
CREATE TABLE public.chat_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL DEFAULT 'Nova conversa',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX chat_threads_user_updated_idx ON public.chat_threads(user_id, updated_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_threads TO authenticated;
GRANT ALL ON public.chat_threads TO service_role;

ALTER TABLE public.chat_threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own threads select" ON public.chat_threads FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own threads insert" ON public.chat_threads FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own threads update" ON public.chat_threads FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own threads delete" ON public.chat_threads FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER chat_threads_touch BEFORE UPDATE ON public.chat_threads FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 2. Add thread_id to conversations
ALTER TABLE public.conversations ADD COLUMN thread_id uuid;

-- 3. Backfill: one thread per user with existing messages
INSERT INTO public.chat_threads (user_id, title, created_at, updated_at)
SELECT DISTINCT user_id, 'Conversas anteriores', MIN(created_at), MAX(created_at)
FROM public.conversations
WHERE thread_id IS NULL
GROUP BY user_id;

UPDATE public.conversations c
SET thread_id = t.id
FROM public.chat_threads t
WHERE c.thread_id IS NULL
  AND t.user_id = c.user_id
  AND t.title = 'Conversas anteriores';

-- 4. Enforce NOT NULL + FK
ALTER TABLE public.conversations
  ALTER COLUMN thread_id SET NOT NULL,
  ADD CONSTRAINT conversations_thread_id_fkey FOREIGN KEY (thread_id) REFERENCES public.chat_threads(id) ON DELETE CASCADE;

CREATE INDEX conversations_thread_created_idx ON public.conversations(thread_id, created_at);
