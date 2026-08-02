CREATE TABLE public.azkar (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL DEFAULT '',
  text text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  count integer NOT NULL DEFAULT 1,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.azkar TO anon;
GRANT SELECT ON public.azkar TO authenticated;
GRANT ALL ON public.azkar TO service_role;

ALTER TABLE public.azkar ENABLE ROW LEVEL SECURITY;

CREATE POLICY "azkar public read" ON public.azkar FOR SELECT USING (true);

CREATE TRIGGER azkar_set_updated_at
BEFORE UPDATE ON public.azkar
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE INDEX azkar_category_sort_idx ON public.azkar (category, sort_order);