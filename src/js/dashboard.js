import { supabase } from './supabase.js';

// Gallery functions
export async function getGallery() {
    const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export async function uploadGalleryImage(file, filePath) {
    const { error } = await supabase.storage
        .from('gallery')
        .upload(filePath, file);

    if (error) throw error;
}

export async function addGalleryItem({ title, image_url, storage_path }) {
    const { error } = await supabase
        .from('gallery')
        .insert([{ title, image_url, storage_path }]);

    if (error) throw error;
}

export async function deleteGalleryItem(id, storagePath) {
    if (storagePath) {
        await supabase.storage
            .from('gallery')
            .remove([storagePath]);
    }

    const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

// Posts functions
export async function getPosts() {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export async function uploadPostImage(file, filePath) {
    const { error } = await supabase.storage
        .from('posts')
        .upload(filePath, file);

    if (error) throw error;
}

export async function addPost({ title, content, category, image_url }) {
    const { error } = await supabase
        .from('posts')
        .insert([{ title, content, category, image_url }]);

    if (error) throw error;
}

export async function deletePost(id) {
    const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

// Utility functions
export function previewImage(event, containerId, fileNameId) {
    const file = event.target.files[0];
    if (!file) return;

    const container = document.getElementById(containerId);
    const preview = container.querySelector('img');
    const fileName = document.getElementById(fileNameId);

    const reader = new FileReader();
    reader.onload = function(e) {
        preview.src = e.target.result;
        container.style.display = 'block';
        fileName.textContent = file.name;
    };
    reader.readAsDataURL(file);
}

// Form handlers
export async function handleGallerySubmit(event) {
    event.preventDefault();
    
    const title = document.getElementById('galleryTitle').value;
    const imageFile = document.getElementById('galleryImage').files[0];
    const loading = document.getElementById('galleryLoading');
    const errorMessage = document.getElementById('galleryError');
    const successMessage = document.getElementById('gallerySuccess');
    const submitBtn = document.getElementById('gallerySubmitBtn');

    if (!imageFile) {
        errorMessage.textContent = 'Pilih foto terlebih dahulu';
        errorMessage.style.display = 'block';
        return;
    }

    try {
        loading.style.display = 'block';
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';
        submitBtn.disabled = true;

        const fileName = `${Date.now()}_${imageFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const filePath = `gallery/${fileName}`;

        await uploadGalleryImage(imageFile, filePath);
        const { data: { publicUrl } } = supabase.storage
            .from('gallery')
            .getPublicUrl(filePath);

        await addGalleryItem({
            title,
            image_url: publicUrl,
            storage_path: filePath
        });

        document.getElementById('galleryForm').reset();
        document.getElementById('galleryPreviewContainer').style.display = 'none';
        successMessage.style.display = 'block';
        await loadGallery();

    } catch (error) {
        console.error('Error:', error);
        errorMessage.textContent = error.message;
        errorMessage.style.display = 'block';
    } finally {
        loading.style.display = 'none';
        submitBtn.disabled = false;
    }
}

export async function handleInfoSubmit(event) {
    event.preventDefault();
    
    const title = document.getElementById('infoTitle').value;
    const content = document.getElementById('infoContent').value;
    const imageFile = document.getElementById('infoImage').files[0];
    const loading = document.getElementById('infoLoading');
    const errorMessage = document.getElementById('infoError');
    const successMessage = document.getElementById('infoSuccess');
    const submitBtn = document.getElementById('infoSubmitBtn');

    try {
        loading.style.display = 'block';
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';
        submitBtn.disabled = true;

        let imageUrl = null;
        if (imageFile) {
            const fileName = `${Date.now()}_${imageFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
            const filePath = `posts/${fileName}`;
            await uploadPostImage(imageFile, filePath);
            const { data: { publicUrl } } = supabase.storage
                .from('posts')
                .getPublicUrl(filePath);
            imageUrl = publicUrl;
        }

        await addPost({
            title,
            content,
            image_url: imageUrl,
            category: 'informasi'
        });

        document.getElementById('infoForm').reset();
        document.getElementById('infoPreviewContainer').style.display = 'none';
        successMessage.style.display = 'block';
        await loadInfo();

    } catch (error) {
        console.error('Error:', error);
        errorMessage.textContent = error.message;
        errorMessage.style.display = 'block';
    } finally {
        loading.style.display = 'none';
        submitBtn.disabled = false;
    }
}

// Edit functions
export function editGalleryItem(id, title, imageUrl) {
    document.getElementById('galleryId').value = id;
    document.getElementById('galleryTitle').value = title;
    document.getElementById('gallerySubmitBtn').textContent = 'Update Foto';
    
    if (imageUrl) {
        document.getElementById('galleryPreviewContainer').style.display = 'block';
        document.getElementById('galleryPreview').src = imageUrl;
    }
}

export function editInfoItem(id, title, content, imageUrl) {
    document.getElementById('infoId').value = id;
    document.getElementById('infoTitle').value = title;
    document.getElementById('infoContent').value = content;
    document.getElementById('infoSubmitBtn').textContent = 'Update Informasi';
    
    if (imageUrl) {
        document.getElementById('infoPreviewContainer').style.display = 'block';
        document.getElementById('infoPreview').src = imageUrl;
    }
}

// Modal functions
export function showDeleteModal(callback) {
    window.deleteItemCallback = callback;
    const modalError = document.getElementById('modalError');
    const modalLoading = document.getElementById('modalLoading');
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    
    modalError.style.display = 'none';
    modalLoading.style.display = 'none';
    confirmBtn.disabled = false;
    
    document.getElementById('deleteModal').style.display = 'flex';
}

export function closeDeleteModal() {
    const modalError = document.getElementById('modalError');
    const modalLoading = document.getElementById('modalLoading');
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    
    modalError.style.display = 'none';
    modalLoading.style.display = 'none';
    confirmBtn.disabled = false;
    
    document.getElementById('deleteModal').style.display = 'none';
    window.deleteItemCallback = null;
}

export async function confirmDelete() {
    if (window.deleteItemCallback) {
        const modalError = document.getElementById('modalError');
        const modalLoading = document.getElementById('modalLoading');
        const confirmBtn = document.getElementById('confirmDeleteBtn');
        const modal = document.getElementById('deleteModal');
        
        try {
            modalError.style.display = 'none';
            modalLoading.style.display = 'block';
            confirmBtn.disabled = true;
            modal.style.pointerEvents = 'none';

            await window.deleteItemCallback();
            await Promise.all([loadGallery(), loadInfo()]);
            closeDeleteModal();
        } catch (error) {
            console.error('Error deleting item:', error);
            modalError.textContent = error?.message || 'Gagal menghapus item. Silakan coba lagi.';
            modalError.style.display = 'block';
        } finally {
            modalLoading.style.display = 'none';
            confirmBtn.disabled = false;
            modal.style.pointerEvents = 'auto';
        }
    }
}

// Logout function
export async function handleLogout() {
    try {
        await supabase.auth.signOut();
        localStorage.removeItem('supabase.auth.token');
        localStorage.removeItem('sb-rzhcxyfapjxjbaeirmfy-auth-token');
        sessionStorage.clear();
        window.location.replace('../index.html');
    } catch (error) {
        console.error('Error saat logout:', error);
        alert('Gagal logout. Silakan coba lagi.');
    }
}

// Content loading functions
export async function loadGallery() {
    const galleryList = document.getElementById('galleryList');
    try {
        const gallery = await getGallery();
        
        galleryList.innerHTML = gallery.map(item => `
            <div class="content-item">
                <img src="${item.image_url}" alt="${item.title}" class="content-thumbnail">
                <div class="content-info">
                    <div class="content-title">${item.title}</div>
                    <div class="content-date">${new Date(item.created_at).toLocaleDateString('id-ID')}</div>
                </div>
                <div class="content-actions">
                    <button class="edit-btn" onclick="editGalleryItem('${item.id}', '${item.title}', '${item.image_url}')">Edit</button>
                    <button class="delete-btn" onclick="showDeleteModal(() => deleteGalleryItem('${item.id}', '${item.storage_path}'))">Hapus</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading gallery:', error);
        galleryList.innerHTML = '<div class="error-message">Gagal memuat galeri</div>';
    }
}

export async function loadInfo() {
    const infoList = document.getElementById('infoList');
    try {
        const posts = await getPosts();
        
        infoList.innerHTML = posts.map(post => `
            <div class="content-item">
                ${post.image_url ? `<img src="${post.image_url}" alt="${post.title}" class="content-thumbnail">` : ''}
                <div class="content-info">
                    <div class="content-title">${post.title}</div>
                    <div class="content-date">${new Date(post.created_at).toLocaleDateString('id-ID')}</div>
                </div>
                <div class="content-actions">
                    <button class="edit-btn" onclick="editInfoItem('${post.id}', '${post.title}', '${post.content}', '${post.image_url || ''}')">Edit</button>
                    <button class="delete-btn" onclick="showDeleteModal(() => deletePost('${post.id}'))">Hapus</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading info:', error);
        infoList.innerHTML = '<div class="error-message">Gagal memuat informasi</div>';
    }
}