/**
 * Контроллер для управления видео переходами
 * Переключение между вступительным и фоновым видео
 */

document.addEventListener('DOMContentLoaded', function() {
    const introVideo = document.getElementById('intro-video');
    const backgroundVideo = document.getElementById('background-video');
    const overlay = document.getElementById('overlay');
    const content = document.getElementById('content');

    // Проверка наличия всех элементов
    if (!introVideo || !backgroundVideo || !overlay || !content) {
        console.error('Не найдены необходимые элементы страницы');
        return;
    }

    // Предзагрузка фонового видео
    backgroundVideo.load();

    /**
     * Переход от вступительного видео к основному контенту
     */
    function transitionToMainContent() {
        // 1. Начать fade-out вступительного видео
        introVideo.classList.add('fade-out');

        // 2. Одновременно показать фоновое видео и оверлей
        setTimeout(() => {
            backgroundVideo.classList.add('visible');
            backgroundVideo.play().catch(error => {
                console.error('Ошибка воспроизведения фонового видео:', error);
            });
            
            overlay.classList.add('visible');
            content.classList.add('visible');
        }, 100);

        // 3. Полностью скрыть вступительное видео после завершения fade-out
        setTimeout(() => {
            introVideo.classList.add('hidden');
        }, 1600); // 1.5s transition + 100ms задержка
    }

    /**
     * Обработчик окончания вступительного видео
     */
    introVideo.addEventListener('ended', function() {
        console.log('Вступительное видео завершено');
        transitionToMainContent();
    });

    /**
     * Обработка ошибок воспроизведения
     */
    introVideo.addEventListener('error', function(e) {
        console.error('Ошибка загрузки вступительного видео:', e);
        // При ошибке сразу показываем основной контент
        transitionToMainContent();
    });

    backgroundVideo.addEventListener('error', function(e) {
        console.error('Ошибка загрузки фонового видео:', e);
    });

    /**
     * Автоматический переход, если видео не загрузилось в течение 15 секунд
     */
    const fallbackTimeout = setTimeout(() => {
        console.warn('Таймаут ожидания видео - принудительный переход');
        transitionToMainContent();
    }, 15000);

    /**
     * Обработка воспроизведения вступительного видео
     */
    introVideo.addEventListener('canplaythrough', function() {
        console.log('Вступительное видео готово к воспроизведению');
    });

    /**
     * Попытка воспроизвести вступительное видео
     * (на некоторых платформах autoplay может быть заблокирован)
     */
    const playPromise = introVideo.play();
    
    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                console.log('Вступительное видео начало воспроизведение');
            })
            .catch(error => {
                console.warn('Автовоспроизведение заблокировано:', error);
                
                // Показываем кнопку для ручного запуска
                const playButton = document.createElement('button');
                playButton.textContent = '▶ Начать';
                playButton.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 10000;
                    padding: 20px 50px;
                    font-size: 1.5rem;
                    background: #1B3A1B;
                    color: white;
                    border: none;
                    border-radius: 50px;
                    cursor: pointer;
                    font-weight: 600;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                    transition: all 0.3s ease;
                `;
                
                playButton.addEventListener('mouseenter', function() {
                    this.style.background = '#2C5530';
                    this.style.transform = 'translate(-50%, -50%) scale(1.05)';
                });
                
                playButton.addEventListener('mouseleave', function() {
                    this.style.background = '#1B3A1B';
                    this.style.transform = 'translate(-50%, -50%) scale(1)';
                });
                
                playButton.addEventListener('click', function() {
                    introVideo.play();
                    this.remove();
                });
                
                document.body.appendChild(playButton);
            });
    }

    /**
     * Оптимизация для мобильных устройств
     */
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        console.log('Мобильное устройство обнаружено');
        
        // На мобильных устройствах можно сразу показывать фоновое видео
        // если вступительное видео короткое или отсутствует
        introVideo.addEventListener('loadedmetadata', function() {
            if (this.duration < 1) {
                // Если видео очень короткое, пропускаем его
                transitionToMainContent();
            }
        });
    }
});