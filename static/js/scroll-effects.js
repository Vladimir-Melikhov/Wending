/**
 * Эффекты прокрутки и интерактивные элементы
 * Intersection Observer для анимаций и счетчик обратного отсчета
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ===========================
    // INTERSECTION OBSERVER ДЛЯ АНИМАЦИЙ ПРИ СКРОЛЛЕ
    // ===========================
    
    const fadeInSections = document.querySelectorAll('.fade-in-section');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };
    
    const fadeInObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Опционально: отключить наблюдение после появления
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    fadeInSections.forEach(section => {
        fadeInObserver.observe(section);
    });
    
    
    // ===========================
    // СЧЕТЧИК ОБРАТНОГО ОТСЧЕТА
    // ===========================
    
    // Дата свадьбы (настроить под нужную дату)
    const weddingDate = new Date('2026-06-15T16:00:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;
        
        if (distance < 0) {
            // Событие уже прошло
            document.querySelector('.countdown-timer').innerHTML = `
                <div class="countdown-item">
                    <span class="countdown-value">🎉</span>
                    <span class="countdown-label">Свадьба состоялась!</span>
                </div>
            `;
            return;
        }
        
        // Вычисление времени
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Обновление DOM
        const daysElement = document.getElementById('days');
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');
        
        if (daysElement) daysElement.textContent = String(days).padStart(2, '0');
        if (hoursElement) hoursElement.textContent = String(hours).padStart(2, '0');
        if (minutesElement) minutesElement.textContent = String(minutes).padStart(2, '0');
        if (secondsElement) secondsElement.textContent = String(seconds).padStart(2, '0');
    }
    
    // Обновлять счетчик каждую секунду
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    
    // ===========================
    // ПЛАВНАЯ ПРОКРУТКА
    // ===========================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    
    // ===========================
    // PARALLAX ЭФФЕКТ (опционально)
    // ===========================
    
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Легкий параллакс для героя
        const heroSection = document.querySelector('.hero-section');
        if (heroSection && scrollTop < window.innerHeight) {
            const offset = scrollTop * 0.5;
            heroSection.style.transform = `translateY(${offset}px)`;
        }
        
        lastScrollTop = scrollTop;
    }, { passive: true });
    
    
    // ===========================
    // АНИМАЦИЯ TIMELINE ПРИ СКРОЛЛЕ
    // ===========================
    
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const timelineObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 100);
            }
        });
    }, {
        threshold: 0.3
    });
    
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        // Чередуем направление появления
        if (index % 2 === 0) {
            item.style.transform = 'translateX(-50px)';
        } else {
            item.style.transform = 'translateX(50px)';
        }
        
        timelineObserver.observe(item);
    });
    
    
    document.body.appendChild(scrollToTopBtn);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 500) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });
    
    
    // ===========================
    // LOADING SCREEN (опционально)
    // ===========================
    
    window.addEventListener('load', function() {
        console.log('Страница полностью загружена');
        
        // Можно добавить логику скрытия loading screen
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
    });
    
    
    // ===========================
    // АНИМАЦИЯ ЧИСЕЛ СЧЕТЧИКА
    // ===========================
    
    function animateCounterValue(element, start, end, duration) {
        if (!element) return;
        
        const range = end - start;
        const increment = range / (duration / 16); // 60 FPS
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                element.textContent = String(Math.floor(end)).padStart(2, '0');
                clearInterval(timer);
            } else {
                element.textContent = String(Math.floor(current)).padStart(2, '0');
            }
        }, 16);
    }
    
    
    // ===========================
    // ДЕТЕКТОР МОБИЛЬНЫХ УСТРОЙСТВ
    // ===========================
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Отключить некоторые эффекты на мобильных
        console.log('Мобильное устройство - упрощенные эффекты');
        
        // Можно отключить parallax
        document.querySelectorAll('.hero-section').forEach(el => {
            el.style.transform = 'none';
        });
    }
});


// ===========================
// ГЛОБАЛЬНЫЕ ФУНКЦИИ
// ===========================

/**
 * Функция подтверждения присутствия
 */
function confirmAttendance(willAttend) {
    const message = willAttend 
        ? 'Спасибо за подтверждение! Мы рады, что вы сможете разделить с нами этот особенный день! 🎉'
        : 'Спасибо, что сообщили нам. Нам будет вас не хватать! 💚';
    
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.8);
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        padding: 40px 60px;
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        z-index: 10000;
        text-align: center;
        max-width: 500px;
        border: 3px solid ${willAttend ? '#1B3A1B' : '#2C5530'};
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    `;
    
    notification.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 20px;">
            ${willAttend ? '🎊' : '💐'}
        </div>
        <p style="font-size: 1.3rem; color: #1B3A1B; font-weight: 500; margin-bottom: 30px;">
            ${message}
        </p>
        <button onclick="this.parentElement.remove()" style="
            padding: 15px 40px;
            background: #1B3A1B;
            color: white;
            border: none;
            border-radius: 30px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        " onmouseover="this.style.background='#2C5530'" 
           onmouseout="this.style.background='#1B3A1B'">
            Закрыть
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);
    
    // Автоматическое закрытие через 5 секунд
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translate(-50%, -50%) scale(0.8)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
    
    // Здесь можно добавить отправку данных на сервер
    console.log('RSVP:', willAttend ? 'Подтверждено' : 'Отклонено');
    
    // Пример отправки на сервер (раскомментировать при необходимости)
    /*
    fetch('/rsvp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            attending: willAttend,
            timestamp: new Date().toISOString()
        })
    })
    .then(response => response.json())
    .then(data => console.log('Ответ сервера:', data))
    .catch(error => console.error('Ошибка:', error));
    */
}