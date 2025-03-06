import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const SUPABASE_URL = 'https://rzhcxyfapjxjbaeirmfy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6aGN4eWZhcGp4amJhZWlybWZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzODY5MTksImV4cCI6MjA1NTk2MjkxOX0.cx8dqPrG_BVgn5eFrSx6EiK-IE3B5a84QmNBNAiSKUI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Gallery functions
export async function getGallery() {
    try {
        const { data, error } = await supabase
            .from('gallery')
            .select('*')
            .limit(12)  // Limit results for better performance
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching gallery:', error);
        throw error;
    }
}

// Posts functions
export async function getPosts() {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .limit(10)  // Limit results for better performance
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
}

// Authentication functions
export async function signIn(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error signing in:', error);
        throw error;
    }
}

export async function signOut() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    } catch (error) {
        console.error('Error signing out:', error);
        throw error;
    }
}

export async function getSession() {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        return session;
    } catch (error) {
        console.error('Error getting session:', error);
        throw error;
    }
}