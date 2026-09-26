// ========== 通用弹窗控制 ==========
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.style.display = 'flex';
        requestAnimationFrame(() => {
            modal.style.opacity = '1';
        });
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

// 点击遮罩关闭弹窗 + ESC 关闭
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal(this.id);
        }
    });
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            if (modal.style.display === 'flex') {
                closeModal(modal.id);
            }
        });
    }
});

// 关闭按钮
document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', function() {
        const id = this.getAttribute('data-close');
        if (id) closeModal(id);
    });
});

// ========== 工具卡片点击事件 ==========
document.getElementById('tomato-card').addEventListener('click', function() {
    openModal('tomato-modal');
});

document.getElementById('ecg-card').addEventListener('click', function() {
    openModal('ecg-modal');
});

// ========== 复制功能 ==========
(function() {
    const toast = document.getElementById('toast');
    let toastTimer = null;

    function showToast(message) {
        toast.textContent = message || '已复制到剪贴板';
        toast.classList.add('show');
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }

    document.querySelectorAll('.copy-item').forEach(item => {
        item.addEventListener('click', function(e) {
            const textToCopy = this.getAttribute('data-copy');
            if (!textToCopy) return;

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    showToast('已复制：' + textToCopy);
                }).catch(() => {
                    fallbackCopy(textToCopy);
                });
            } else {
                fallbackCopy(textToCopy);
            }
        });
    });

    function fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        textarea.style.pointerEvents = 'none';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showToast('已复制：' + text);
            } else {
                showToast('复制失败，请手动复制');
            }
        } catch (err) {
            showToast('复制失败，请手动复制');
        }
        document.body.removeChild(textarea);
    }
})();
