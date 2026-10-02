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

// ========== 工具卡片点击事件 ==========
function bindCardClick(elementId, modalId) {
    const card = document.getElementById(elementId);
    if (!card) return;

    card.addEventListener('click', function(e) {
        e.preventDefault();
        openModal(modalId);
    });

    card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openModal(modalId);
        }
    });
}

bindCardClick('tomato-card', 'tomato-modal');
bindCardClick('ecg-card', 'ecg-modal');
bindCardClick('wujing-card', 'wujing-modal');

// ========== 成员卡片点击事件（弹出模态框） ==========
document.querySelectorAll('.member-card').forEach(card => {
    card.addEventListener('click', function(e) {
        if (e.target.closest('.copy-item') || e.target.closest('.submenu-app')) return;
        const modalId = this.getAttribute('data-modal');
        if (modalId) {
            openModal(modalId);
        }
    });

    card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            if (e.target.closest('.copy-item') || e.target.closest('.submenu-app')) return;
            e.preventDefault();
            const modalId = this.getAttribute('data-modal');
            if (modalId) {
                openModal(modalId);
            }
        }
    });
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

    document.addEventListener('click', function(e) {
        const item = e.target.closest('.copy-item');
        if (!item) return;

        e.preventDefault();
        e.stopPropagation();
        const textToCopy = item.getAttribute('data-copy');
        if (!textToCopy) return;
        copyText(textToCopy);
    });

    document.addEventListener('keydown', function(e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        const item = e.target.closest('.copy-item');
        if (!item) return;

        e.preventDefault();
        e.stopPropagation();
        const textToCopy = item.getAttribute('data-copy');
        if (!textToCopy) return;
        copyText(textToCopy);
    });
})();

// ========== 开发软件格子点击（跳转到上方卡片） ==========
(function() {
    function scrollToTarget(targetId) {
        if (targetId === 'top') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        const target = document.getElementById(targetId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            target.classList.add('highlight');
            setTimeout(() => {
                target.classList.remove('highlight');
            }, 1600);
        }
    }

    document.querySelectorAll('.submenu-app').forEach(app => {
        app.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const targetId = this.getAttribute('data-scroll');
            if (targetId) {
                const modal = this.closest('.modal-overlay');
                if (modal) closeModal(modal.id);
                setTimeout(() => {
                    scrollToTarget(targetId);
                }, 350);
            }
        });

        app.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                const targetId = this.getAttribute('data-scroll');
                if (targetId) {
                    const modal = this.closest('.modal-overlay');
                    if (modal) closeModal(modal.id);
                    setTimeout(() => {
                        scrollToTarget(targetId);
                    }, 350);
                }
            }
        });
    });
})();

// ========== 深色模式监听 ==========
(function() {
    if (window.matchMedia) {
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        if (darkModeQuery.addEventListener) {
            darkModeQuery.addEventListener('change', () => {
                // 现代浏览器会自动应用 CSS 媒体查询
            });
        }
    }
})();
