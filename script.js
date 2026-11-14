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

    window.showToast = function(message, isNotice) {
        toast.textContent = message || '已复制到剪贴板';
        toast.classList.toggle('notice', !!isNotice);
        toast.classList.add('show');
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, isNotice ? 2800 : 2000);
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
    // ================== 地区合规限制 ==================
    // 根据相关法律法规要求，以下国家/地区的设备不可使用音乐组件：
    // 中国大陆（CN）、中国香港（HK）、中国澳门（MO）、日本（JP）
    const BLOCKED_COUNTRIES = ['CN', 'HK', 'MO', 'JP'];

    // IP 定位不可用时，按设备时区兜底判断
    const BLOCKED_TIMEZONES = [
        'Asia/Shanghai', 'Asia/Chongqing', 'Asia/Harbin',
        'Asia/Urumqi', 'Asia/Kashgar',
        'Asia/Hong_Kong', 'Asia/Macau',
        'Asia/Tokyo'
    ];

    // IP 与时区均不可用时，按浏览器语言兜底判断
    const BLOCKED_LANGUAGES = ['zh-cn', 'zh-hans', 'zh-hans-cn', 'zh-hk', 'zh-mo', 'ja', 'ja-jp'];

    function isBlockedByTimezone() {
        try {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
            return BLOCKED_TIMEZONES.indexOf(tz) !== -1;
        } catch (e) {
            return false;
        }
    }

    function isBlockedByLanguage() {
        const langs = (navigator.languages && navigator.languages.length)
            ? navigator.languages
            : [navigator.language || ''];
        return langs.some(function(lang) {
            return BLOCKED_LANGUAGES.indexOf(String(lang).toLowerCase()) !== -1;
        });
    }

    // 综合判断当前设备是否位于受限地区
    // 优先级：IP 定位（Cloudflare trace）> 设备时区 > 浏览器语言
    function detectRegionBlocked() {
        return new Promise(function(resolve) {
            let settled = false;
            function finish(result) {
                if (!settled) {
                    settled = true;
                    resolve(result);
                }
            }
            function fallbackCheck() {
                finish(isBlockedByTimezone() || isBlockedByLanguage());
            }

            // IP 请求超时则回退到时区/语言判断
            const timer = setTimeout(fallbackCheck, 2500);

            fetch('https://www.cloudflare.com/cdn-cgi/trace', { cache: 'no-store' })
                .then(function(res) {
                    if (!res.ok) throw new Error('HTTP ' + res.status);
                    return res.text();
                })
                .then(function(text) {
                    clearTimeout(timer);
                    const match = text.match(/(?:^|\n)loc=([A-Za-z]{2})/);
                    if (match) {
                        // IP 定位成功：按 IP 判定，并结合设备时区
                        finish(BLOCKED_COUNTRIES.indexOf(match[1].toUpperCase()) !== -1 || isBlockedByTimezone());
                    } else {
                        fallbackCheck();
                    }
                })
                .catch(function() {
                    clearTimeout(timer);
                    fallbackCheck();
                });
        });
    }

    // 受限地区：进入禁用状态，点击给出提示，且不加载任何音频、不自动播放
    function enableBlockedState() {
        const toggle = document.getElementById('music-toggle');
        if (!toggle) return;
        toggle.classList.add('region-blocked');
        toggle.setAttribute('aria-disabled', 'true');
        toggle.setAttribute('title', '由于相关法律法规，此组件在当前国家和地区无法使用');
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (window.showToast) {
                window.showToast('由于相关法律法规，此组件在当前国家和地区无法使用', true);
            }
        });
    }

    // ================== 播放器初始化（仅非受限地区执行） ==================
    function initPlayer() {
        // 歌曲列表数据
        const musicList = [
            {
                title: "おはなばたけ (花田)",
                artist: "近藤浩治",
                src: "B1.mp3"
            },
            {
                title: "Counting Stars",
                artist: "OneRepublic",
                src: "OneRepublic - Counting Stars_L.mp3"
            },
            {
                title: "Maybe(prod. lukrative & mixed matches)",
                artist: "mixed matches",
                src: "mixed matches - Maybe(prod. lukrative & mixed matches).mp3"
            },
            {
                title: "Sample This（氛围纯享）",
                artist: "Unicorn",
                src: "Unicorn - Sample This（氛围纯享）.mp3"
            },
            {
                title: "Sample this",
                artist: "highroom",
                src: "highroom - Sample this (佳楠小曲).mp3"
            },
            {
                title: "菊次郎的夏天",
                artist: "K.Williams",
                src: "K.Williams - 菊次郎的夏天.mp3"
            },
            {
                title: "鸟之诗",
                artist: "V.A.",
                src: "V.A. - 鸟之诗.mp3"
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

        // 查找默认歌曲“おはなばたけ (花田)”的索引，找不到则用第一首
        const defaultSongIndex = musicList.findIndex(song => song.title === 'おはなばたけ (花田)');
        const initIndex = defaultSongIndex !== -1 ? defaultSongIndex : 0;

        // 初始化
        renderMusicList();
        loadSong(initIndex);

        // ================== 自动播放逻辑处理 ==================
        // 尝试立即播放
        const playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                // 自动播放成功
                console.log("自动播放成功");
            }).catch(error => {
                // 自动播放被浏览器拦截（通常是因为没有用户交互）
                console.log("自动播放被拦截，等待用户首次交互...");

                // 定义一个触发播放的函数
                const startPlayOnInteraction = () => {
                    audio.play().then(() => {
                        // 播放成功，移除监听器
                        document.removeEventListener('click', startPlayOnInteraction);
                        document.removeEventListener('touchstart', startPlayOnInteraction);
                        document.removeEventListener('keydown', startPlayOnInteraction);
                    }).catch(e => console.log("仍然无法播放:", e));
                };

                // 监听用户第一次点击、触摸或按键，立刻开始播放
                document.addEventListener('click', startPlayOnInteraction, { once: true });
                document.addEventListener('touchstart', startPlayOnInteraction, { once: true });
                document.addEventListener('keydown', startPlayOnInteraction, { once: true });
            });
        }
    }

    // 启动：先判断所在地区，再决定是否初始化播放器
    detectRegionBlocked().then(function(blocked) {
        if (blocked) {
            enableBlockedState();
        } else {
            initPlayer();
        }
    });
})();
