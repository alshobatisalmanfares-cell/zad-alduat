CREATE TABLE public.categories (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 name text NOT NULL UNIQUE CHECK (length(trim(name)) > 0),
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories public read" ON public.categories FOR SELECT TO anon, authenticated USING (true);
ALTER TABLE public.khutab ADD COLUMN categories text[] NOT NULL DEFAULT '{}';
ALTER TABLE public.khutab ADD COLUMN tags text[] NOT NULL DEFAULT '{}';
UPDATE public.khutab SET categories = ARRAY[category] WHERE trim(category) <> '';
INSERT INTO public.categories (name) SELECT DISTINCT category FROM public.khutab WHERE trim(category) <> '' ON CONFLICT (name) DO NOTHING;
CREATE OR REPLACE FUNCTION public.sync_sermon_category_names() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
 IF TG_OP = 'UPDATE' AND OLD.name IS DISTINCT FROM NEW.name THEN
  UPDATE public.khutab SET categories = array_replace(categories, OLD.name, NEW.name), category = CASE WHEN category = OLD.name THEN NEW.name ELSE category END WHERE OLD.name = ANY(categories) OR category = OLD.name;
 ELSIF TG_OP = 'DELETE' THEN
  UPDATE public.khutab SET categories = array_remove(categories, OLD.name), category = COALESCE((array_remove(categories, OLD.name))[1], '') WHERE OLD.name = ANY(categories) OR category = OLD.name;
 END IF;
 RETURN COALESCE(NEW, OLD);
END;
$$;
CREATE TRIGGER categories_sync_sermons AFTER UPDATE OR DELETE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.sync_sermon_category_names();
CREATE OR REPLACE FUNCTION public.validate_sermon_categories() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
 IF TG_OP = 'INSERT' AND cardinality(NEW.categories) = 0 AND trim(NEW.category) <> '' THEN NEW.categories := ARRAY[NEW.category];
 ELSIF TG_OP = 'UPDATE' AND NEW.category IS DISTINCT FROM OLD.category AND NEW.categories IS NOT DISTINCT FROM OLD.categories THEN
  NEW.categories := CASE WHEN trim(NEW.category) = '' THEN '{}'::text[] ELSE ARRAY[NEW.category] END;
 END IF;
 IF EXISTS (SELECT 1 FROM unnest(NEW.categories) n WHERE NOT EXISTS (SELECT 1 FROM public.categories c WHERE c.name = n)) THEN RAISE EXCEPTION 'Unknown sermon category'; END IF;
 NEW.category := COALESCE(NEW.categories[1], '');
 RETURN NEW;
END;
$$;
CREATE TRIGGER khutab_validate_categories BEFORE INSERT OR UPDATE OF category, categories ON public.khutab FOR EACH ROW EXECUTE FUNCTION public.validate_sermon_categories();