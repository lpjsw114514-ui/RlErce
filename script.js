// ========== 通用弹窗控制 ==========
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.style.display = 'flex';
        document.body.classList.add('modal-open');
        requestAnimationFrame(() => {
            modal.style.opacity = '1';
        });
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.style.opacity = '0';
        document.body.classList.remove('modal-open');
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

// ========== 工具卡片点击事件（兼容触控和键盘） ==========
function bindCardClick(elementId, modalId) {
    const card = document.getElementById(elementId);
    if (!card) return;

    // 点击事件
    card.addEventListener('click', function(e) {
        e.preventDefault();
        openModal(modalId);
    });

    // 键盘回车/空格触发（无障碍）
    card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openModal(modalId);
        }
    });
}

bindCardClick('tomato-card', 'tomato-modal');
bindCardClick('ecg-card', 'ecg-modal');

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

    // 为所有 copy-item 绑定点击和键盘事件
    document.querySelectorAll('.copy-item').forEach(item => {
        // 点击
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const textToCopy = this.getAttribute('data-copy');
            if (!textToCopy) return;
            copyText(textToCopy);
        });

        // 键盘
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const textToCopy = this.getAttribute('data-copy');
                if (!textToCopy) return;
                copyText(textToCopy);
            }
        });
    });

    function copyText(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                showToast('已复制：' + text);
            }).catch(() => {
                fallbackCopy(text);
            });
        } else {
            fallbackCopy(text);
        }
    }

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
