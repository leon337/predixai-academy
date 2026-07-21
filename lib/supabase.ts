import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bexwaglmhncvstjhwlfz.supabase.co";
const supabasePublishableKey = "sb_publishable_DkaQJJMVEgCj6pZk36MRVA_PWUVVknb";

export const supabase = createClient(supabaseUrl, supabasePublishableKey);
