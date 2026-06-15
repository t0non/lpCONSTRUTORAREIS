import re

def run():
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Add Lucide CDN before </head>
    if '<script src="https://unpkg.com/lucide@latest"></script>' not in html:
        html = html.replace('</head>', '  <script src="https://unpkg.com/lucide@latest"></script>\n</head>')

    # Mapping of emojis to Lucide icons
    replacements = {
        '✅': '<i data-lucide="check-circle-2" class="icon-sm"></i>',
        '🏆': '<i data-lucide="trophy" class="icon-lg"></i>',
        '⭐': '<i data-lucide="star" class="icon-sm fill-gold"></i>',
        '⭐⭐⭐⭐⭐': '<div class="stars"><i data-lucide="star" class="fill-gold"></i><i data-lucide="star" class="fill-gold"></i><i data-lucide="star" class="fill-gold"></i><i data-lucide="star" class="fill-gold"></i><i data-lucide="star" class="fill-gold"></i></div>',
        '🔒': '<i data-lucide="lock" class="icon-sm"></i>',
        '📋': '<i data-lucide="clipboard-check" class="icon-lg"></i>',
        '🏗️': '<i data-lucide="hard-hat" class="icon-lg"></i>',
        '📅': '<i data-lucide="calendar-days" class="icon-lg"></i>',
        '📐': '<i data-lucide="pencil-ruler" class="icon-lg"></i>',
        '🔨': '<i data-lucide="hammer" class="icon-lg"></i>',
        '⚡': '<i data-lucide="zap" class="icon-lg"></i>',
        '🎨': '<i data-lucide="paint-roller" class="icon-lg"></i>',
        '🧱': '<i data-lucide="boxes" class="icon-lg"></i>',
        '🎯': '<i data-lucide="target" class="icon-xl"></i>',
        '🛡️': '<i data-lucide="shield-check" class="icon-lg"></i>',
        '💡': '<i data-lucide="lightbulb" class="icon-lg"></i>',
        '💬': '<i data-lucide="message-square" class="icon-sm"></i>',
        '🔍': '<i data-lucide="search" class="icon-lg"></i>',
        '📊': '<i data-lucide="bar-chart-3" class="icon-lg"></i>',
        '🗝️': '<i data-lucide="key" class="icon-lg"></i>',
        '📱': '<i data-lucide="smartphone" class="icon-md"></i>',
        '📞': '<i data-lucide="phone" class="icon-md"></i>',
        '📧': '<i data-lucide="mail" class="icon-md"></i>',
        '📍': '<i data-lucide="map-pin" class="icon-sm"></i>',
        '⏰': '<i data-lucide="clock" class="icon-sm"></i>'
    }

    # Custom handling for specific ones where size class needs to differ
    # For CTA buttons and form
    html = html.replace('💬 Falar no WhatsApp', '<i data-lucide="message-circle" class="icon-sm"></i> Falar no WhatsApp')
    html = html.replace('💬 Falar com Especialista Agora', '<i data-lucide="message-circle" class="icon-sm"></i> Falar com Especialista Agora')
    html = html.replace('💬 Solicitar Orçamento pelo WhatsApp', '<i data-lucide="message-circle" class="icon-sm"></i> Solicitar Orçamento pelo WhatsApp')
    html = html.replace('💬 Solicitar Orçamento', '<i data-lucide="message-circle" class="icon-sm"></i> Solicitar Orçamento')
    html = html.replace('💬 Começar Agora pelo WhatsApp', '<i data-lucide="message-circle" class="icon-sm"></i> Começar Agora pelo WhatsApp')
    html = html.replace('💬 Tirar Dúvidas no WhatsApp', '<i data-lucide="message-circle" class="icon-sm"></i> Tirar Dúvidas no WhatsApp')
    
    # Process remaining generic emojis
    for emoji, icon_html in replacements.items():
        html = html.replace(emoji, icon_html)

    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)

if __name__ == '__main__':
    run()
