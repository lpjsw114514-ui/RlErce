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
        if (e.target === this) closeModal(this.id);
    });
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            if (modal.style.display === 'flex') closeModal(modal.id);
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
        if (modalId) openModal(modalId);
    });

    card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            if (e.target.closest('.copy-item') || e.target.closest('.submenu-app')) return;
            e.preventDefault();
            const modalId = this.getAttribute('data-modal');
            if (modalId) openModal(modalId);
        }
    });
});

// ========== 复制功能 ==========
(function() {
    const toast = document.getElementById('toast');
    let toastTimer = null;

    window.showToast = function(message) {
        toast.textContent = message || '已复制到剪贴板';
        toast.classList.add('show');
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    };

    function copyText(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                window.showToast('已复制：' + text);
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
                window.showToast('已复制：' + text);
            } else {
                window.showToast('复制失败，请手动复制');
            }
        } catch (err) {
            window.showToast('复制失败，请手动复制');
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
    });
})();

// ========== 番茄钟下载区交互 ==========
document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById('toggle-download');
    const optionsDiv = document.getElementById('download-options');
    
    if (toggleBtn && optionsDiv) {
        toggleBtn.addEventListener('click', function() {
            optionsDiv.classList.toggle('active');
            if (optionsDiv.classList.contains('active')) {
                toggleBtn.textContent = '收起下载选项';
            } else {
                toggleBtn.textContent = '立刻下载';
            }
        });
    }

    // 处理 "暂不支持" 按钮
    document.querySelectorAll('[data-action="not-supported"]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            window.showToast('暂不支持');
        });
    });
});

// ========== 背景音乐播放器 ==========
(function() {
    // 歌曲列表数据
    const musicList = [
        {
            title: "Counting Stars",
            artist: "OneRepublic",
            src: "OneRepublic - Counting Stars_L.mp3"
        },
        {
            title: "Maybe(prod. lukrative & mixed matches)",
            artist: "mixed matches",
            src: "mixed matches - Maybe(prod. lukrative & mixed matches).mp3"
        }
    ];

    let currentIndex = 0;
    let playMode = 'list'; // 'list' 或 'single'
    const audio = new Audio();
    
    const musicToggle = document.getElementById('music-toggle');
    const musicPanel = document.getElementById('music-panel');
    const musicTitle = document.getElementById('music-title');
    const musicArtist = document.getElementById('music-artist');
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const modeBtn = document.getElementById('mode-btn');
    const musicListContainer = document.getElementById('music-list');

    // 初始化渲染列表
    function renderMusicList() {
        musicListContainer.innerHTML = '';
        musicList.forEach((song, index) => {
            const div = document.createElement('div');
            div.className = `music-item ${index === currentIndex ? 'active' : ''}`;
            div.innerHTML = `
                <span class="music-item-title">${song.title}</span>
                <span class="music-item-artist">${song.artist}</span>
            `;
            div.addEventListener('click', () => {
                loadSong(index);
                playSong();
            });
            musicListContainer.appendChild(div);
        });
    }

    // 加载歌曲
    function loadSong(index) {
        currentIndex = index;
        const song = musicList[index];
        audio.src = song.src;
        musicTitle.textContent = song.title;
        musicArtist.textContent = song.artist;
        
        // 更新列表高亮
        const items = musicListContainer.querySelectorAll('.music-item');
        items.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
        updatePlayButton();
    }

    // 更新播放/暂停按钮状态
    function updatePlayButton() {
        if (audio.paused) {
            playBtn.textContent = '▶';
            musicToggle.classList.remove('playing');
        } else {
            playBtn.textContent = '⏸';
            musicToggle.classList.add('playing');
        }
    }

    // 播放
    function playSong() {
        audio.play().catch(e => {
            console.log('播放被阻止或文件不存在:', e);
            window.showToast('播放失败，请检查音频文件');
        });
    }

    // 暂停
    function pauseSong() {
        audio.pause();
    }

    // 点击面板外关闭面板
    document.addEventListener('click', function(e) {
        if (musicPanel.classList.contains('show') && 
            !musicPanel.contains(e.target) && 
            !musicToggle.contains(e.target)) {
            musicPanel.classList.remove('show');
        }
    });

    // 悬浮按钮点击事件
    musicToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        musicPanel.classList.toggle('show');
    });

    // 播放/暂停按钮点击事件
    playBtn.addEventListener('click', function() {
        if (audio.paused) playSong();
        else pauseSong();
    });

    // 上一首
    prevBtn.addEventListener('click', function() {
        let newIndex = currentIndex - 1;
        if (newIndex < 0) newIndex = musicList.length - 1;
        loadSong(newIndex);
        playSong();
    });

    // 下一首
    nextBtn.addEventListener('click', function() {
        let newIndex = currentIndex + 1;
        if (newIndex >= musicList.length) newIndex = 0;
        loadSong(newIndex);
        playSong();
    });

    // 播放模式切换
    modeBtn.addEventListener('click', function() {
        if (playMode === 'list') {
            playMode = 'single';
            modeBtn.textContent = '🔂';
            window.showToast('单曲循环');
        } else {
            playMode = 'list';
            modeBtn.textContent = '🔁';
            window.showToast('列表循环');
        }
    });

    // 监听播放状态改变
    audio.addEventListener('play', updatePlayButton);
    audio.addEventListener('pause', updatePlayButton);
    
    // 播放结束处理
    audio.addEventListener('ended', function() {
        if (playMode === 'single') {
            audio.currentTime = 0;
            playSong();
        } else {
            let newIndex = currentIndex + 1;
            if (newIndex >= musicList.length) newIndex = 0;
            loadSong(newIndex);
            playSong();
        }
    });

    // 初始化
    renderMusicList();
    loadSong(0);
})();
