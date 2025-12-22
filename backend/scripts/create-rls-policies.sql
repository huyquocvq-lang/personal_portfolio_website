-- RLS Policies for Blog Tables
-- Apply this migration if you want to use ANON_KEY with policies
-- Otherwise, use SERVICE_ROLE_KEY for backend (recommended)

-- Policy for blog_posts: Allow public to read published posts
CREATE POLICY "Public can read published posts"
ON blog_posts
FOR SELECT
USING (status = 'published');

-- Policy for tags: Allow public to read all tags
CREATE POLICY "Public can read tags"
ON tags
FOR SELECT
USING (true);

-- Policy for blog_post_tags: Allow public to read all relations
CREATE POLICY "Public can read blog_post_tags"
ON blog_post_tags
FOR SELECT
USING (true);

-- Note: Write operations (INSERT, UPDATE, DELETE) are not allowed for anonymous users
-- Backend should use SERVICE_ROLE_KEY for write operations

