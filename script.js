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

    // 绑定所有 copy-item（包括底部和成员二级菜单内的）
    document.querySelectorAll('.copy-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const textToCopy = this.getAttribute('data-copy');
            if (!textToCopy) return;
            copyText(textToCopy);
        });

        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                const textToCopy = this.getAttribute('data-copy');
                if (!textToCopy) return;
                copyText(textToCopy);
            }
        });
    });

    // 暴露给内部使用
    window.__copyText = copyText;
})();

// ========== 成员卡片二级菜单展开/收起 ==========
(function() {
    document.querySelectorAll('.member-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // 点击内部可交互元素时不触发折叠
            if (e.target.closest('.copy-item') ||
                e.target.closest('.submenu-app') ||
                e.target.closest('.member-submenu .submenu-avatar') ||
                e.target.closest('.member-submenu .submenu-avatar.placeholder')) {
                return;
            }
            this.classList.toggle('expanded');
        });

        // 键盘支持
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                if (e.target.closest('.copy-item') || e.target.closest('.submenu-app')) return;
                e.preventDefault();
                this.classList.toggle('expanded');
            }
        });
    });
})();

// ========== 二级菜单内的开发软件格子点击（滚动到上方对应卡片） ==========
(function() {
    function scrollToTarget(targetId) {
        if (targetId === 'top') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        const target = document.getElementById(targetId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // 高亮提示
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
            if (targetId) scrollToTarget(targetId);
        });

        app.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                const targetId = this.getAttribute('data-scroll');
                if (targetId) scrollToTarget(targetId);
            }
        });
    });
})();

// ========== 深色模式变化监听（可选，用于未来扩展） ==========
(function() {
    if (window.matchMedia) {
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        // 现代浏览器会自动应用 CSS 媒体查询，无需手动处理
        // 此处保留监听接口，方便未来扩展
        if (darkModeQuery.addEventListener) {
            darkModeQuery.addEventListener('change', () => {
                // 可根据需要添加额外的逻辑
            });
        }
    }
})();
