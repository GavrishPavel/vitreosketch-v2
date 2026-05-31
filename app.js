const stage = document.getElementById('stage');
const cameraFeed = document.getElementById('cameraFeed');
const SHARE_API_BASE = '/api/scenes';

const languageMeta = {
  en: { label: 'English', title: 'VitreoSketch — Floater Visualizer' },
  ru: { label: 'Русский', title: 'VitreoSketch — Визуализатор помутнений' },
  es: { label: 'Español', title: 'VitreoSketch — Visualizador de miodesopsias' },
  pt: { label: 'Português', title: 'VitreoSketch — Visualizador de moscas volantes' },
  zh: { label: '中文', title: 'VitreoSketch — 飞蚊症可视化工具' },
  ar: { label: 'العربية', title: 'VitreoSketch — أداة تصور عوائم العين' }
};

const translations = {
  en: {
    title: 'Floater visualizer & editor',
    lead: 'Compose an MVP simulation of common vitreous floater shapes, then animate them with gentle drift or camera-based eye tracking.',
    eyeTitle: '1. Eye setup',
    activeEye: 'Editing eye',
    leftEye: 'Left eye',
    rightEye: 'Right eye',
    previewEyes: 'Preview eyes',
    previewActiveOnly: 'Active eye only',
    previewBothEyes: 'Both eyes',
    addTitle: '2. Add floaters',
    presetDot: 'Dot cluster',
    presetRing: 'Ring',
    presetThread: 'Thread',
    presetCobweb: 'Cobweb',
    presetSmudge: 'Smudge',
    presetCloud: 'Cloud',
    addHint: 'Based on commonly described forms: spots, rings/Weiss rings, thread-like strands, cobwebs, cloudy smudges, and diffuse cloud-like floaters.',
    drawTitle: '3. Draw your own',
    brushSize: 'Brush size',
    brushAlpha: 'Stroke alpha',
    enableDrawing: 'Enable drawing',
    drawingEnabled: 'Drawing enabled',
    clearDrawings: 'Clear drawings',
    selectionTitle: '4. Selected floater',
    selectionNone: 'Nothing selected',
    selectionActive: 'Selected',
    selectionHint: 'Click a floater or drawing to edit it. Drag to reposition. Ctrl/Cmd+C copies the active-eye object, Delete removes the selected object.',
    contrast: 'Contrast',
    blur: 'Blur',
    structure: 'Structure',
    scale: 'Scale',
    rotation: 'Rotation',
    duplicateSelected: 'Duplicate',
    deleteSelected: 'Delete selected',
    motionTitle: '5. Motion',
    randomDrift: 'Random drift',
    eyeTracking: 'Eye tracking',
    eyeTrackingInfo: 'Eye tracking uses your front camera locally in the browser. It estimates iris movement and eyelid motion to shift floaters in the opposite direction. No video leaves your device.',
    motionIntensity: 'Motion intensity',
    startMotion: 'Start movement',
    stopMotion: 'Stop movement',
    cameraOff: 'Camera off',
    cameraNeedsHttps: 'Camera needs HTTPS or localhost',
    cameraActive: 'Camera active',
    cameraPermissionFailed: 'Camera permission failed',
    sceneTitle: '6. Scene',
    sceneBeach: 'Beach',
    sceneSnow: 'Snow',
    scenePlain: 'No background',
    resetScene: 'Reset scene',
    loadStarterSet: 'Load starter set',
    preview: 'Preview',
    shareLink: 'Share link',
    shareLinkCopied: 'Link copied',
    shareLinkFailed: 'Copy failed — link saved in address bar',
    downloadPng: 'Download PNG',
    pngPreparing: 'Preparing PNG…',
    downloadPdf: 'Download PDF',
    pdfPreparing: 'Preparing PDF…',
    reportTitle: 'Scene summary',
    leftEyeReport: 'Left eye',
    rightEyeReport: 'Right eye',
    reportNone: 'No floaters added',
    reportDrawing: 'Drawing',
    focusMode: 'Focus mode',
    exitFocusMode: 'Exit focus mode',
    fullscreen: 'Fullscreen',
    stageHint: 'Tip: pick an eye to edit, then preview the active eye or both eyes moving independently. Eye tracking works on HTTPS / GitHub Pages.',
    navFloaters: 'Floater simulator',
    navLysis: 'Lysis · game'
  },
  ru: {
    title: 'Визуализатор и редактор помутнений',
    lead: 'Соберите свою сцену с типичными помутнениями стекловидного тела и запустите движение: случайный дрейф или слежение по взгляду через камеру.',
    eyeTitle: '1. Настройка глаза',
    activeEye: 'Редактируемый глаз',
    leftEye: 'Левый глаз',
    rightEye: 'Правый глаз',
    previewEyes: 'Предпросмотр глаз',
    previewActiveOnly: 'Только активный глаз',
    previewBothEyes: 'Оба глаза',
    addTitle: '2. Добавьте помутнения',
    presetDot: 'Точки',
    presetRing: 'Кольцо',
    presetThread: 'Нить',
    presetCobweb: 'Паутина',
    presetSmudge: 'Пятно',
    presetCloud: 'Облако',
    addHint: 'Основано на частых описаниях: точки, кольца/кольцо Вейса, нитевидные полосы, паутинка, мутные пятна и облачные помутнения.',
    drawTitle: '3. Нарисуйте своё',
    brushSize: 'Размер кисти',
    brushAlpha: 'Прозрачность штриха',
    enableDrawing: 'Включить рисование',
    drawingEnabled: 'Рисование включено',
    clearDrawings: 'Очистить рисунок',
    selectionTitle: '4. Выбранный объект',
    selectionNone: 'Ничего не выбрано',
    selectionActive: 'Выбрано',
    selectionHint: 'Кликни по помутнению или рисунку, чтобы редактировать его. Перетаскивай мышкой. Ctrl/Cmd+C копирует объект активного глаза, Delete удаляет выбранный объект.',
    contrast: 'Контрастность',
    blur: 'Размытие',
    structure: 'Структура',
    scale: 'Масштаб',
    rotation: 'Поворот',
    duplicateSelected: 'Дублировать',
    deleteSelected: 'Удалить выбранное',
    motionTitle: '5. Движение',
    randomDrift: 'Случайный дрейф',
    eyeTracking: 'Отслеживание взгляда',
    eyeTrackingInfo: 'Отслеживание взгляда использует фронтальную камеру локально в браузере. Приложение оценивает движение радужки и век, чтобы сдвигать помутнения в противоположную сторону. Видео никуда не отправляется.',
    motionIntensity: 'Интенсивность движения',
    startMotion: 'Запустить движение',
    stopMotion: 'Остановить движение',
    cameraOff: 'Камера выключена',
    cameraNeedsHttps: 'Для камеры нужен HTTPS или localhost',
    cameraActive: 'Камера включена',
    cameraPermissionFailed: 'Не удалось получить доступ к камере',
    sceneTitle: '6. Сцена',
    sceneBeach: 'Пляж',
    sceneSnow: 'Снег',
    scenePlain: 'Без фона',
    resetScene: 'Сбросить сцену',
    loadStarterSet: 'Загрузить набор',
    preview: 'Предпросмотр',
    shareLink: 'Поделиться ссылкой',
    shareLinkCopied: 'Ссылка скопирована',
    shareLinkFailed: 'Не удалось скопировать — ссылка обновлена в адресной строке',
    downloadPng: 'Скачать PNG',
    pngPreparing: 'Готовлю PNG…',
    downloadPdf: 'Скачать PDF',
    pdfPreparing: 'Готовлю PDF…',
    reportTitle: 'Краткий отчёт по сцене',
    leftEyeReport: 'Левый глаз',
    rightEyeReport: 'Правый глаз',
    reportNone: 'Помутнения не добавлены',
    reportDrawing: 'Рисунок',
    focusMode: 'Режим просмотра',
    exitFocusMode: 'Выйти из режима',
    fullscreen: 'На весь экран',
    stageHint: 'Совет: выбери глаз для редактирования, а затем смотри только его или оба глаза с независимым движением. Слежение за глазами работает на HTTPS / GitHub Pages.',
    navFloaters: 'Симулятор помутнений',
    navLysis: 'Лизис · игра'
  },
  es: {
    title: 'Visualizador y editor de miodesopsias',
    lead: 'Compón una simulación MVP de formas comunes de miodesopsias vítreas y anímalas con una deriva suave o con seguimiento ocular mediante cámara.',
    eyeTitle: '1. Configuración del ojo',
    activeEye: 'Ojo en edición',
    leftEye: 'Ojo izquierdo',
    rightEye: 'Ojo derecho',
    previewEyes: 'Vista de ojos',
    previewActiveOnly: 'Solo ojo activo',
    previewBothEyes: 'Ambos ojos',
    addTitle: '2. Añadir miodesopsias',
    presetDot: 'Grupo de puntos',
    presetRing: 'Anillo',
    presetThread: 'Hilo',
    presetCobweb: 'Telaraña',
    presetSmudge: 'Mancha',
    presetCloud: 'Nube',
    addHint: 'Basado en descripciones frecuentes: puntos, anillos/anillo de Weiss, hebras filamentosas, telarañas, manchas turbias y nubes difusas.',
    drawTitle: '3. Dibuja la tuya',
    brushSize: 'Tamaño del pincel',
    brushAlpha: 'Opacidad del trazo',
    enableDrawing: 'Activar dibujo',
    drawingEnabled: 'Dibujo activado',
    clearDrawings: 'Borrar dibujos',
    selectionTitle: '4. Miodesopsia seleccionada',
    selectionNone: 'Nada seleccionado',
    selectionActive: 'Seleccionado',
    selectionHint: 'Haz clic en una miodesopsia o dibujo para editarlo. Arrastra para recolocarlo. Ctrl/Cmd+C copia el objeto del ojo activo y Delete elimina el objeto seleccionado.',
    contrast: 'Contraste',
    blur: 'Desenfoque',
    structure: 'Estructura',
    scale: 'Escala',
    rotation: 'Rotación',
    duplicateSelected: 'Duplicar',
    deleteSelected: 'Eliminar seleccionado',
    motionTitle: '5. Movimiento',
    randomDrift: 'Deriva aleatoria',
    eyeTracking: 'Seguimiento ocular',
    eyeTrackingInfo: 'El seguimiento ocular usa tu cámara frontal localmente en el navegador. Estima el movimiento del iris y de los párpados para desplazar las miodesopsias en dirección opuesta. Ningún video sale de tu dispositivo.',
    motionIntensity: 'Intensidad del movimiento',
    startMotion: 'Iniciar movimiento',
    stopMotion: 'Detener movimiento',
    cameraOff: 'Cámara desactivada',
    cameraNeedsHttps: 'La cámara necesita HTTPS o localhost',
    cameraActive: 'Cámara activa',
    cameraPermissionFailed: 'No se pudo obtener permiso para la cámara',
    sceneTitle: '6. Escena',
    sceneBeach: 'Playa',
    sceneSnow: 'Nieve',
    scenePlain: 'Sin fondo',
    resetScene: 'Restablecer escena',
    loadStarterSet: 'Cargar conjunto inicial',
    preview: 'Vista previa',
    shareLink: 'Compartir enlace',
    shareLinkCopied: 'Enlace copiado',
    shareLinkFailed: 'No se pudo copiar; el enlace quedó en la barra de direcciones',
    downloadPng: 'Descargar PNG',
    pngPreparing: 'Preparando PNG…',
    downloadPdf: 'Descargar PDF',
    pdfPreparing: 'Preparando PDF…',
    focusMode: 'Modo enfoque',
    exitFocusMode: 'Salir del modo enfoque',
    fullscreen: 'Pantalla completa',
    stageHint: 'Consejo: elige qué ojo editar y luego visualiza solo ese ojo o ambos moviéndose de forma independiente. El seguimiento ocular funciona en HTTPS / GitHub Pages.',
    navFloaters: 'Simulador de miodesopsias',
    navLysis: 'Vitreólisis · juego'
  },
  pt: {
    title: 'Visualizador e editor de moscas volantes',
    lead: 'Monte uma simulação MVP de formas comuns de moscas volantes vítreas e depois anime tudo com deriva suave ou rastreamento ocular pela câmera.',
    eyeTitle: '1. Configuração do olho',
    activeEye: 'Olho em edição',
    leftEye: 'Olho esquerdo',
    rightEye: 'Olho direito',
    previewEyes: 'Visualização dos olhos',
    previewActiveOnly: 'Só olho ativo',
    previewBothEyes: 'Ambos os olhos',
    addTitle: '2. Adicionar moscas volantes',
    presetDot: 'Grupo de pontos',
    presetRing: 'Anel',
    presetThread: 'Filamento',
    presetCobweb: 'Teia',
    presetSmudge: 'Mancha',
    presetCloud: 'Nuvem',
    addHint: 'Baseado em descrições comuns: pontos, anéis/anel de Weiss, filamentos, teias, manchas turvas e nuvens difusas.',
    drawTitle: '3. Desenhe a sua',
    brushSize: 'Tamanho do pincel',
    brushAlpha: 'Opacidade do traço',
    enableDrawing: 'Ativar desenho',
    drawingEnabled: 'Desenho ativado',
    clearDrawings: 'Limpar desenhos',
    selectionTitle: '4. Mosca volante selecionada',
    selectionNone: 'Nada selecionado',
    selectionActive: 'Selecionado',
    selectionHint: 'Clique em uma mosca volante ou desenho para editar. Arraste para reposicionar. Ctrl/Cmd+C copia o objeto do olho ativo e Delete remove o objeto selecionado.',
    contrast: 'Contraste',
    blur: 'Desfoque',
    structure: 'Estrutura',
    scale: 'Escala',
    rotation: 'Rotação',
    duplicateSelected: 'Duplicar',
    deleteSelected: 'Excluir selecionado',
    motionTitle: '5. Movimento',
    randomDrift: 'Deriva aleatória',
    eyeTracking: 'Rastreamento ocular',
    eyeTrackingInfo: 'O rastreamento ocular usa a câmera frontal localmente no navegador. Ele estima o movimento da íris e das pálpebras para deslocar as moscas volantes na direção oposta. Nenhum vídeo sai do seu dispositivo.',
    motionIntensity: 'Intensidade do movimento',
    startMotion: 'Iniciar movimento',
    stopMotion: 'Parar movimento',
    cameraOff: 'Câmera desligada',
    cameraNeedsHttps: 'A câmera precisa de HTTPS ou localhost',
    cameraActive: 'Câmera ativa',
    cameraPermissionFailed: 'Falha ao obter permissão da câmera',
    sceneTitle: '6. Cena',
    sceneBeach: 'Praia',
    sceneSnow: 'Neve',
    scenePlain: 'Sem fundo',
    resetScene: 'Redefinir cena',
    loadStarterSet: 'Carregar conjunto inicial',
    preview: 'Pré-visualização',
    shareLink: 'Compartilhar link',
    shareLinkCopied: 'Link copiado',
    shareLinkFailed: 'Falha ao copiar; o link ficou na barra de endereço',
    downloadPng: 'Baixar PNG',
    pngPreparing: 'Preparando PNG…',
    downloadPdf: 'Baixar PDF',
    pdfPreparing: 'Preparando PDF…',
    focusMode: 'Modo foco',
    exitFocusMode: 'Sair do modo foco',
    fullscreen: 'Tela cheia',
    stageHint: 'Dica: escolha qual olho editar e depois visualize só ele ou ambos se movendo de forma independente. O rastreamento ocular funciona em HTTPS / GitHub Pages.',
    navFloaters: 'Simulador de moscas volantes',
    navLysis: 'Vitreólise · jogo'
  },
  zh: {
    title: '飞蚊症可视化与编辑器',
    lead: '创建一个常见玻璃体飞蚊形态的 MVP 模拟，并通过轻微漂移或基于摄像头的眼动追踪让它动起来。',
    eyeTitle: '1. 眼别设置',
    activeEye: '当前编辑眼睛',
    leftEye: '左眼',
    rightEye: '右眼',
    previewEyes: '预览眼睛',
    previewActiveOnly: '仅当前眼睛',
    previewBothEyes: '双眼',
    addTitle: '2. 添加飞蚊',
    presetDot: '点状簇',
    presetRing: '环状',
    presetThread: '丝状',
    presetCobweb: '网状',
    presetSmudge: '污斑',
    presetCloud: '云雾',
    addHint: '基于常见描述：点状、环状/魏斯环、丝状条纹、蛛网状、模糊污斑和弥散云雾。',
    drawTitle: '3. 自己绘制',
    brushSize: '画笔大小',
    brushAlpha: '笔迹透明度',
    enableDrawing: '启用绘制',
    drawingEnabled: '绘制已启用',
    clearDrawings: '清除绘图',
    selectionTitle: '4. 已选飞蚊',
    selectionNone: '未选择任何对象',
    selectionActive: '已选择',
    selectionHint: '点击飞蚊或绘图即可编辑，拖动可重新定位。Ctrl/Cmd+C 复制当前眼睛对象，Delete 删除当前选中的对象。',
    contrast: '对比度',
    blur: '模糊',
    structure: '结构',
    scale: '缩放',
    rotation: '旋转',
    duplicateSelected: '复制',
    deleteSelected: '删除所选',
    motionTitle: '5. 运动',
    randomDrift: '随机漂移',
    eyeTracking: '眼动追踪',
    eyeTrackingInfo: '眼动追踪会在浏览器中本地使用前置摄像头。它会估算虹膜与眼睑运动，并让飞蚊向相反方向偏移。视频不会离开你的设备。',
    motionIntensity: '运动强度',
    startMotion: '开始运动',
    stopMotion: '停止运动',
    cameraOff: '摄像头已关闭',
    cameraNeedsHttps: '摄像头需要 HTTPS 或 localhost',
    cameraActive: '摄像头已开启',
    cameraPermissionFailed: '无法获取摄像头权限',
    sceneTitle: '6. 场景',
    sceneBeach: '海滩',
    sceneSnow: '雪景',
    scenePlain: '无背景',
    resetScene: '重置场景',
    loadStarterSet: '加载初始组合',
    preview: '预览',
    shareLink: '分享链接',
    shareLinkCopied: '链接已复制',
    shareLinkFailed: '复制失败，链接已保留在地址栏',
    downloadPng: '下载 PNG',
    pngPreparing: '正在生成 PNG…',
    downloadPdf: '下载 PDF',
    pdfPreparing: '正在生成 PDF…',
    focusMode: '专注模式',
    exitFocusMode: '退出专注模式',
    fullscreen: '全屏',
    stageHint: '提示：先选择要编辑的眼睛，再预览单眼或双眼独立运动。眼动追踪可在 HTTPS / GitHub Pages 上启用。',
    navFloaters: '飞蚊症模拟器',
    navLysis: '玻璃体消融 · 游戏'
  },
  ar: {
    title: 'أداة تصور وتحرير عوائم العين',
    lead: 'أنشئ محاكاة أولية لأشكال عوائم الجسم الزجاجي الشائعة، ثم حرّكها بانجراف لطيف أو بتتبع حركة العين عبر الكاميرا.',
    eyeTitle: '1. إعداد العين',
    activeEye: 'العين قيد التحرير',
    leftEye: 'العين اليسرى',
    rightEye: 'العين اليمنى',
    previewEyes: 'معاينة العينين',
    previewActiveOnly: 'العين النشطة فقط',
    previewBothEyes: 'كلتا العينين',
    addTitle: '2. أضف العوائم',
    presetDot: 'مجموعة نقاط',
    presetRing: 'حلقة',
    presetThread: 'خيط',
    presetCobweb: 'شبكة',
    presetSmudge: 'لطخة',
    presetCloud: 'سحابة',
    addHint: 'مبني على أوصاف شائعة: نقاط، حلقات/حلقة فايس، خيوط رفيعة، شبكات، لطخات ضبابية، وعوائم سحابية منتشرة.',
    drawTitle: '3. ارسم الشكل بنفسك',
    brushSize: 'حجم الفرشاة',
    brushAlpha: 'شفافية الخط',
    enableDrawing: 'تفعيل الرسم',
    drawingEnabled: 'تم تفعيل الرسم',
    clearDrawings: 'مسح الرسومات',
    selectionTitle: '4. العائمة المحددة',
    selectionNone: 'لا يوجد تحديد',
    selectionActive: 'محدد',
    selectionHint: 'انقر على عائمة أو رسم لتعديله. اسحب لإعادة التموضع. Ctrl/Cmd+C ينسخ عنصر العين النشطة وDelete يحذف العنصر المحدد.',
    contrast: 'التباين',
    blur: 'التمويه',
    structure: 'البنية',
    scale: 'المقياس',
    rotation: 'الدوران',
    duplicateSelected: 'نسخ',
    deleteSelected: 'حذف المحدد',
    motionTitle: '5. الحركة',
    randomDrift: 'انجراف عشوائي',
    eyeTracking: 'تتبع العين',
    eyeTrackingInfo: 'يستخدم تتبع العين الكاميرا الأمامية محليًا داخل المتصفح. ويقدّر حركة القزحية والجفون لتحريك العوائم بالاتجاه المعاكس. لا يغادر أي فيديو جهازك.',
    motionIntensity: 'شدة الحركة',
    startMotion: 'بدء الحركة',
    stopMotion: 'إيقاف الحركة',
    cameraOff: 'الكاميرا متوقفة',
    cameraNeedsHttps: 'تحتاج الكاميرا إلى HTTPS أو localhost',
    cameraActive: 'الكاميرا مفعلة',
    cameraPermissionFailed: 'فشل الحصول على إذن الكاميرا',
    sceneTitle: '6. المشهد',
    sceneBeach: 'الشاطئ',
    sceneSnow: 'الثلج',
    scenePlain: 'بدون خلفية',
    resetScene: 'إعادة ضبط المشهد',
    loadStarterSet: 'تحميل مجموعة البداية',
    preview: 'المعاينة',
    shareLink: 'مشاركة الرابط',
    shareLinkCopied: 'تم نسخ الرابط',
    shareLinkFailed: 'تعذر النسخ، لكن الرابط موجود في شريط العنوان',
    downloadPng: 'تنزيل PNG',
    pngPreparing: 'جارٍ تجهيز PNG…',
    downloadPdf: 'تنزيل PDF',
    pdfPreparing: 'جارٍ تجهيز PDF…',
    focusMode: 'وضع التركيز',
    exitFocusMode: 'الخروج من وضع التركيز',
    fullscreen: 'ملء الشاشة',
    stageHint: 'نصيحة: اختر العين التي تريد تحريرها، ثم عاين عينًا واحدة أو كلتا العينين مع حركة مستقلة. تتبع العين يعمل على HTTPS / GitHub Pages.',
    navFloaters: 'محاكي عوائم العين',
    navLysis: 'استئصال الزجاجي · لعبة'
  }
};

const EYES = ['left', 'right'];
function createEyeState() { return { items: [], drawings: [], selection: { type: null, id: null }, randomTarget: { x: 0, y: 0 }, motionOffset: { x: 0, y: 0 }, motionTarget: { x: 0, y: 0 }, eyeTarget: { x: 0, y: 0 }, elements: { motionLayer: null, floaterLayer: null, drawLayer: null } }; }
const state = { eyes: { left: createEyeState(), right: createEyeState() }, activeEye: 'left', previewMode: 'both', clipboard: null, drawingEnabled: false, drawingPath: null, lastPointer: null, motionMode: 'random', motionIntensity: 0.8, motionRunning: true, brushSize: 4, brushAlpha: 0.25, scene: 'plain', eye: { active: false, baseEyeLidDistance: null, faceMesh: null, camera: null, stream: null }, language: (function(){ try { const s = localStorage.getItem('vitro_lang'); if (s) return s; } catch(e){} return 'en'; })(), focusPreview: false, dragging: { eye: null, type: null, id: null, pointerId: null, dx: 0, dy: 0 } };
let shareUrlSyncTimer = null;

const presetButtons = document.querySelectorAll('[data-preset]');
const sceneButtons = document.querySelectorAll('[data-scene]');
const motionInputs = document.querySelectorAll('input[name="motionMode"]');
const controls = {
  itemContrast: document.getElementById('itemContrast'), itemBlur: document.getElementById('itemBlur'), itemStructure: document.getElementById('itemStructure'), itemScale: document.getElementById('itemScale'), itemRotation: document.getElementById('itemRotation'), motionIntensity: document.getElementById('motionIntensity'), brushSize: document.getElementById('brushSize'), brushAlpha: document.getElementById('brushAlpha'), drawToggle: document.getElementById('drawToggle'), clearDrawings: document.getElementById('clearDrawings'), resetScene: document.getElementById('resetScene'), toggleMotion: document.getElementById('toggleMotion'), cameraStatus: document.getElementById('cameraStatus'), languageSelect: document.getElementById('languageSelect'), previewMode: document.getElementById('previewMode'), fullscreenMode: document.getElementById('fullscreenMode'), shareLink: document.getElementById('shareLink'), downloadPng: document.getElementById('downloadPng'), downloadPdf: document.getElementById('downloadPdf'), toast: document.getElementById('toast'), selectionStatus: document.getElementById('selectionStatus'), duplicateSelected: document.getElementById('duplicateSelected'), deleteSelected: document.getElementById('deleteSelected'), activeEyeButtons: document.querySelectorAll('[data-eye-target]'), previewEyeButtons: document.querySelectorAll('[data-preview-eyes]'), eyeTrackingInfoButton: document.getElementById('eyeTrackingInfoButton'), eyeTrackingInfoPopover: document.getElementById('eyeTrackingInfoPopover') };

function rand(min, max) { return Math.random() * (max - min) + min; }
function uid() { return `${Date.now()}-${Math.random().toString(16).slice(2)}`; }
function stageRect() { return stage.getBoundingClientRect(); }
function t(key) { return translations[state.language][key] || translations.en[key] || key; }
function isRtlLanguage(lang) { return lang === 'ar'; }
function eyeState(eye = state.activeEye) { return state.eyes[eye]; }
function activeSelection() { return eyeState().selection; }
function selectedItem(eye = state.activeEye) { const currentEye = eyeState(eye); return currentEye.selection.type === 'item' ? currentEye.items.find((item) => item.id === currentEye.selection.id) || null : null; }
function selectedDrawing(eye = state.activeEye) { const currentEye = eyeState(eye); return currentEye.selection.type === 'drawing' ? currentEye.drawings.find((drawing) => drawing.id === currentEye.selection.id) || null : null; }
function eyeKeyLabel(eye) { return eye === 'left' ? 'leftEye' : 'rightEye'; }

function ensureStageLayers() { EYES.forEach((eye) => { const motionLayer = document.getElementById(`${eye}MotionLayer`); state.eyes[eye].elements.motionLayer = motionLayer; state.eyes[eye].elements.floaterLayer = motionLayer.querySelector('.floater-layer'); state.eyes[eye].elements.drawLayer = motionLayer.querySelector('.draw-layer'); }); }
function makeItem(type, x = rand(20, 80), y = rand(20, 80), overrides = {}) { return { id: uid(), type, x, y, rotation: overrides.rotation ?? rand(-20, 20), scale: overrides.scale ?? rand(0.35, 2.6), density: overrides.density ?? rand(0.7, 1.2), contrast: overrides.contrast ?? 0.55, blur: overrides.blur ?? 9, structure: overrides.structure ?? 0.45, dotPattern: overrides.dotPattern ?? Array.from({ length: 6 }, () => ({ cx: rand(40, 190), cy: rand(40, 190), r: rand(8, 28) })), driftSeed: rand(0, Math.PI * 2), element: null, eye: overrides.eye ?? state.activeEye }; }
function setViewBox() { EYES.forEach((eye) => { const drawLayer = state.eyes[eye].elements.drawLayer; if (!drawLayer) return; const rect = drawLayer.getBoundingClientRect(); drawLayer.setAttribute('viewBox', `0 0 ${Math.max(1, rect.width)} ${Math.max(1, rect.height)}`); }); }
function populateLanguageSelect() { controls.languageSelect.innerHTML = Object.entries(languageMeta).map(([code, meta]) => `<option value="${code}">${meta.label}</option>`).join(''); controls.languageSelect.value = state.language; }

function updateMotionButton() { controls.toggleMotion.textContent = state.motionRunning ? t('stopMotion') : t('startMotion'); controls.toggleMotion.classList.toggle('ghost', !state.motionRunning); }
function serializeState() {
  return {
    version: 1,
    language: state.language,
    activeEye: state.activeEye,
    previewMode: state.previewMode,
    motionMode: state.motionMode,
    motionIntensity: state.motionIntensity,
    motionRunning: state.motionRunning,
    brushSize: state.brushSize,
    brushAlpha: state.brushAlpha,
    scene: state.scene,
    eyes: Object.fromEntries(EYES.map((eye) => [eye, {
      items: state.eyes[eye].items.map(({ id, type, x, y, rotation, scale, density, contrast, blur, structure, dotPattern, driftSeed, eye: itemEye }) => ({ id, type, x, y, rotation, scale, density, contrast, blur, structure, dotPattern, driftSeed, eye: itemEye })),
      drawings: state.eyes[eye].drawings.map(({ id, type, x, y, contrast, blur, structure, scale, rotation, size, alpha, points, bounds, eye: drawingEye }) => ({ id, type, x, y, contrast, blur, structure, scale, rotation, size, alpha, points, bounds, eye: drawingEye }))
    }]))
  };
}
function encodeSceneState() {
  const json = JSON.stringify(serializeState());
  if (window.LZString?.compressToEncodedURIComponent) {
    return window.LZString.compressToEncodedURIComponent(json);
  }
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}
function decodeSceneState(value) {
  if (window.LZString?.decompressFromEncodedURIComponent) {
    const decompressed = window.LZString.decompressFromEncodedURIComponent(value);
    if (decompressed) return JSON.parse(decompressed);
  }
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - normalized.length % 4) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}
function applySerializedState(snapshot) {
  if (!snapshot?.eyes) return;
  state.language = languageMeta[snapshot.language] ? snapshot.language : state.language;
  state.activeEye = EYES.includes(snapshot.activeEye) ? snapshot.activeEye : 'left';
  state.previewMode = snapshot.previewMode === 'active' ? 'active' : 'both';
  state.motionMode = snapshot.motionMode === 'eye' ? 'eye' : 'random';
  state.motionIntensity = Number(snapshot.motionIntensity) || 0.8;
  state.motionRunning = snapshot.motionRunning !== false;
  state.brushSize = Number(snapshot.brushSize) || 4;
  state.brushAlpha = Number(snapshot.brushAlpha) || 0.25;
  state.scene = ['plain', 'beach', 'snow'].includes(snapshot.scene) ? snapshot.scene : 'plain';
  EYES.forEach((eye) => {
    const savedEye = snapshot.eyes?.[eye] || {};
    state.eyes[eye].items = (savedEye.items || []).map((item) => ({ ...makeItem(item.type || 'dot', item.x ?? 50, item.y ?? 50, { ...item, eye }), id: item.id || uid(), driftSeed: item.driftSeed ?? rand(0, Math.PI * 2), element: null }));
    state.eyes[eye].drawings = (savedEye.drawings || []).map((drawing) => ({ id: drawing.id || uid(), type: 'drawing', x: drawing.x ?? 0, y: drawing.y ?? 0, contrast: drawing.contrast ?? 0.55, blur: drawing.blur ?? 4, structure: drawing.structure ?? 0.45, scale: drawing.scale ?? 1, rotation: drawing.rotation ?? 0, size: drawing.size ?? 4, alpha: drawing.alpha ?? 0.25, points: Array.isArray(drawing.points) ? drawing.points : [{ x: 0, y: 0 }], bounds: drawing.bounds || { minX: 0, minY: 0, width: 1, height: 1 }, eye }));
    state.eyes[eye].selection = { type: null, id: null };
  });
}
function updateShareUrl() {
  const url = new URL(window.location.href);
  url.searchParams.delete('s');
  url.hash = `scene=${encodeSceneState()}`;
  history.replaceState(null, '', url.toString());
  return url.toString();
}
function buildShortSceneUrl(sceneId) {
  const url = new URL(window.location.href);
  url.hash = '';
  url.searchParams.set('s', sceneId);
  return url.toString();
}
async function createShortSceneUrl() {
  const response = await fetch(SHARE_API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: serializeState() })
  });
  if (!response.ok) throw new Error(`Failed to save scene: ${response.status}`);
  const payload = await response.json();
  if (!payload?.id) throw new Error('No scene id returned');
  const shortUrl = buildShortSceneUrl(payload.id);
  history.replaceState(null, '', shortUrl);
  return shortUrl;
}
function showToast(message) {
  if (!controls.toast) return;
  controls.toast.textContent = message;
  controls.toast.hidden = false;
  clearTimeout(controls.toast._hideTimer);
  controls.toast._hideTimer = setTimeout(() => {
    controls.toast.hidden = true;
  }, 2200);
}
function queueShareUrlSync() {
  clearTimeout(shareUrlSyncTimer);
  shareUrlSyncTimer = setTimeout(() => updateShareUrl(), 80);
}
async function shareCurrentScene() {
  let url;
  try {
    url = await createShortSceneUrl();
  } catch (error) {
    console.error('Short link failed, falling back to local URL', error);
    url = updateShareUrl();
  }
  try {
    await navigator.clipboard.writeText(url);
    showToast(t('shareLinkCopied'));
  } catch (error) {
    console.error(error);
    showToast(t('shareLinkFailed'));
  }
}
function summarizeEye(eye) {
  const currentEye = state.eyes[eye];
  const counts = new Map();
  currentEye.items.forEach((item) => {
    const label = t(`preset${item.type.charAt(0).toUpperCase()}${item.type.slice(1)}`);
    counts.set(label, (counts.get(label) || 0) + 1);
  });
  if (currentEye.drawings.length) {
    counts.set(t('reportDrawing'), (counts.get(t('reportDrawing')) || 0) + currentEye.drawings.length);
  }
  if (!counts.size) return t('reportNone');
  return Array.from(counts.entries()).map(([label, count]) => `${label} × ${count}`).join(', ');
}
function wrapCanvasText(ctx, text, maxWidth) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  words.forEach((word) => {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width <= maxWidth || !line) {
      line = next;
    } else {
      lines.push(line);
      line = word;
    }
  });
  if (line) lines.push(line);
  return lines.length ? lines : [''];
}
async function buildPdfReportCanvas(stageCanvas) {
  const reportCanvas = document.createElement('canvas');
  reportCanvas.width = 1800;
  reportCanvas.height = 2400;
  const ctx = reportCanvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, reportCanvas.width, reportCanvas.height);
  ctx.fillStyle = '#101828';
  ctx.textBaseline = 'top';
  ctx.font = '700 42px Inter, Arial, sans-serif';
  ctx.fillText('VitreoSketch PDF', 80, 72);
  ctx.font = '400 24px Inter, Arial, sans-serif';
  ctx.fillStyle = '#475467';
  ctx.fillText(t('reportTitle'), 80, 132);

  const contentX = 80;
  const labelWidth = 210;
  const contentWidth = reportCanvas.width - contentX * 2 - labelWidth;
  let currentY = 196;
  const lineHeight = 34;

  const sections = [
    { label: `${t('leftEyeReport')}:`, text: summarizeEye('left') },
    { label: `${t('rightEyeReport')}:`, text: summarizeEye('right') }
  ];

  sections.forEach((section) => {
    ctx.fillStyle = '#101828';
    ctx.font = '700 24px Inter, Arial, sans-serif';
    ctx.fillText(section.label, contentX, currentY);
    ctx.font = '400 24px Inter, Arial, sans-serif';
    ctx.fillStyle = '#344054';
    const lines = wrapCanvasText(ctx, section.text, contentWidth);
    lines.forEach((line, index) => {
      ctx.fillText(line, contentX + labelWidth, currentY + index * lineHeight);
    });
    currentY += Math.max(lineHeight, lines.length * lineHeight) + 24;
  });

  const imageTop = currentY + 18;
  const maxImageWidth = reportCanvas.width - contentX * 2;
  const maxImageHeight = reportCanvas.height - imageTop - 80;
  const scale = Math.min(maxImageWidth / stageCanvas.width, maxImageHeight / stageCanvas.height);
  const drawWidth = stageCanvas.width * scale;
  const drawHeight = stageCanvas.height * scale;
  const drawX = (reportCanvas.width - drawWidth) / 2;
  ctx.drawImage(stageCanvas, drawX, imageTop, drawWidth, drawHeight);

  return reportCanvas;
}
async function downloadCurrentPng() {
  const button = controls.downloadPng;
  const previous = button.textContent;
  button.textContent = t('pngPreparing');
  button.disabled = true;
  try {
    document.body.classList.add('exporting-pdf');
    const canvas = await html2canvas(stage, { backgroundColor: null, scale: Math.min(3, window.devicePixelRatio || 2), useCORS: true, logging: false });
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `vitreosketch-${new Date().toISOString().slice(0, 10)}.png`;
    link.click();
  } finally {
    document.body.classList.remove('exporting-pdf');
    button.disabled = false;
    button.textContent = previous;
  }
}
async function downloadCurrentPdf() {
  const button = controls.downloadPdf;
  const previous = button.textContent;
  button.textContent = t('pdfPreparing');
  button.disabled = true;
  const wasPreview = state.focusPreview;
  try {
    document.body.classList.add('exporting-pdf');
    const stageCanvas = await html2canvas(stage, { backgroundColor: null, scale: Math.min(3, window.devicePixelRatio || 2), useCORS: true, logging: false });
    await document.fonts?.ready;
    const reportCanvas = await buildPdfReportCanvas(stageCanvas);
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 18;
    const ratio = Math.min((pageWidth - margin * 2) / reportCanvas.width, (pageHeight - margin * 2) / reportCanvas.height);
    const renderWidth = reportCanvas.width * ratio;
    const renderHeight = reportCanvas.height * ratio;
    const x = (pageWidth - renderWidth) / 2;
    const y = (pageHeight - renderHeight) / 2;
    pdf.addImage(reportCanvas.toDataURL('image/png'), 'PNG', x, y, renderWidth, renderHeight, undefined, 'FAST');
    pdf.save(`vitreosketch-${new Date().toISOString().slice(0, 10)}.pdf`);
  } finally {
    document.body.classList.remove('exporting-pdf');
    button.disabled = false;
    button.textContent = previous;
    if (wasPreview) document.body.classList.add('preview-only');
  }
}
async function loadSceneFromUrl() {
  const url = new URL(window.location.href);
  const sceneId = url.searchParams.get('s');
  if (sceneId) {
    try {
      const response = await fetch(`${SHARE_API_BASE}/${encodeURIComponent(sceneId)}`);
      if (!response.ok) throw new Error(`Failed to load saved scene: ${response.status}`);
      const payload = await response.json();
      if (payload?.data) {
        applySerializedState(payload.data);
        EYES.forEach((eye) => { renderItems(eye); renderDrawings(eye); });
        applyScene();
        applyTranslations();
        controls.motionIntensity.value = String(state.motionIntensity);
        controls.brushSize.value = String(state.brushSize);
        controls.brushAlpha.value = String(state.brushAlpha);
        motionInputs.forEach((input) => { input.checked = input.value === state.motionMode; });
        updateEyeUi();
        updateMotionButton();
      }
      return;
    } catch (error) {
      console.error('Failed to load saved scene from API', error);
    }
  }
  const hash = window.location.hash || '';
  const match = hash.match(/scene=([^&]+)/);
  if (!match) return;
  try {
    applySerializedState(decodeSceneState(match[1]));
  } catch (error) {
    console.error('Failed to load scene from URL', error);
  }
}
function updateCameraStatus() {
  if (state.motionMode === 'eye' && !state.eye.active && controls.cameraStatus.dataset.errorKey) {
    controls.cameraStatus.textContent = t(controls.cameraStatus.dataset.errorKey);
    return;
  }
  controls.cameraStatus.textContent = state.eye.active ? t('cameraActive') : t('cameraOff');
}

function applyTranslations() {
  document.documentElement.lang = state.language;
  document.documentElement.dir = isRtlLanguage(state.language) ? 'rtl' : 'ltr';
  document.body.classList.toggle('rtl', isRtlLanguage(state.language));
  document.title = languageMeta[state.language]?.title || languageMeta.en.title;
  document.querySelectorAll('[data-i18n]').forEach((node) => { node.textContent = t(node.dataset.i18n); });
  controls.drawToggle.textContent = state.drawingEnabled ? t('drawingEnabled') : t('enableDrawing');
  controls.previewMode.textContent = state.focusPreview ? t('exitFocusMode') : t('focusMode');
  controls.languageSelect.value = state.language;
  updateMotionButton();
  updateCameraStatus();
  updateEyeUi();
  updateSelectionUi();
  queueShareUrlSync();
}

function applyScene() {
  stage.classList.remove('scene-beach', 'scene-snow', 'scene-plain');
  stage.classList.add(`scene-${state.scene}`);
  sceneButtons.forEach((button) => button.classList.toggle('active', button.dataset.scene === state.scene));
  queueShareUrlSync();
}

function svgForItem(item) {
  const opacity = (item.contrast * 0.6 + 0.12).toFixed(2); const strokeOpacity = Math.max(0.08, item.contrast * 0.45).toFixed(2); const strokeWidth = (1.2 + item.structure * 3.4).toFixed(2); const blur = item.blur; const defs = `<defs><filter id="b-${item.id}" x="-45%" y="-45%" width="190%" height="190%" filterUnits="objectBoundingBox"><feGaussianBlur stdDeviation="${blur}" /></filter></defs>`; const fill = `rgba(35, 35, 35, ${opacity})`; const stroke = `rgba(20, 20, 20, ${strokeOpacity})`;
  if (item.type === 'dot') return `<svg class="floater-svg" width="220" height="220" viewBox="0 0 220 220">${defs}<g filter="url(#b-${item.id})">${(item.dotPattern || []).map((point) => `<circle cx="${point.cx}" cy="${point.cy}" r="${point.r * item.density}" fill="${fill}" />`).join('')}</g></svg>`;
  if (item.type === 'ring') return `<svg class="floater-svg" width="300" height="300" viewBox="0 0 300 300">${defs}<g filter="url(#b-${item.id})"><circle cx="150" cy="150" r="64" fill="none" stroke="${stroke}" stroke-width="${8 + item.structure * 10}" /><circle cx="150" cy="150" r="24" fill="rgba(20,20,20,${Math.max(0.03, item.contrast * 0.14).toFixed(2)})" /></g></svg>`;
  if (item.type === 'thread') { const sway = 35 + item.structure * 90; return `<svg class="floater-svg" width="280" height="180" viewBox="0 0 280 180">${defs}<g filter="url(#b-${item.id})"><path d="M18 90 C 70 ${90 - sway}, 130 ${90 + sway}, 190 92 S 245 ${95 - sway * 0.45}, 262 88" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round"/></g></svg>`; }
  if (item.type === 'cobweb') return `<svg class="floater-svg" width="300" height="230" viewBox="0 0 300 230">${defs}<g filter="url(#b-${item.id})"><path d="M24 122 C 58 35, 110 52, 144 114 S 232 186, 279 103" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}"/><path d="M72 154 C 99 115, 122 88, 165 102 S 210 139, 240 164" fill="none" stroke="${stroke}" stroke-width="${(strokeWidth * 0.8).toFixed(2)}"/><path d="M55 72 C 102 112, 132 120, 193 96" fill="none" stroke="${stroke}" stroke-width="${(strokeWidth * 0.65).toFixed(2)}"/></g></svg>`;
  if (item.type === 'cloud') return `<svg class="floater-svg" width="280" height="190" viewBox="0 0 280 190">${defs}<g filter="url(#b-${item.id})"><ellipse cx="88" cy="100" rx="48" ry="28" fill="rgba(35,35,35,${Math.max(0.07, item.contrast * 0.18).toFixed(2)})" /><ellipse cx="136" cy="88" rx="62" ry="34" fill="rgba(35,35,35,${Math.max(0.08, item.contrast * 0.22).toFixed(2)})" /><ellipse cx="188" cy="104" rx="58" ry="31" fill="rgba(35,35,35,${Math.max(0.06, item.contrast * 0.18).toFixed(2)})" /><ellipse cx="144" cy="112" rx="92" ry="38" fill="rgba(35,35,35,${Math.max(0.04, item.contrast * 0.11).toFixed(2)})" /></g></svg>`;
  return `<svg class="floater-svg" width="260" height="180" viewBox="0 0 260 180">${defs}<g filter="url(#b-${item.id})"><ellipse cx="130" cy="90" rx="76" ry="40" fill="rgba(35,35,35,${Math.max(0.08, item.contrast * 0.25).toFixed(2)})" /><ellipse cx="160" cy="92" rx="42" ry="22" fill="rgba(35,35,35,${Math.max(0.05, item.contrast * 0.14).toFixed(2)})" /></g></svg>`;
}

function buildDrawingPath(points) { if (!points.length) return ''; if (points.length === 1) return `M ${points[0].x} ${points[0].y}`; let d = `M ${points[0].x} ${points[0].y}`; for (let i = 1; i < points.length; i += 1) { const prev = points[i - 1]; const point = points[i]; d += ` Q ${prev.x} ${prev.y} ${(prev.x + point.x) / 2} ${(prev.y + point.y) / 2}`; } const last = points[points.length - 1]; return `${d} L ${last.x} ${last.y}`; }
function createDrawingFromPoint(point) { return { id: uid(), type: 'drawing', x: point.x, y: point.y, contrast: 0.55, blur: Math.max(2, state.brushSize * 0.6), structure: 0.45, scale: 1, rotation: 0, size: state.brushSize, alpha: state.brushAlpha, points: [{ x: 0, y: 0 }], bounds: { minX: 0, minY: 0, width: 1, height: 1 }, eye: state.activeEye }; }
function addPointToDrawing(drawing, point) { drawing.points.push({ x: point.x - drawing.x, y: point.y - drawing.y }); normalizeDrawing(drawing); }
function normalizeDrawing(drawing) { const xs = drawing.points.map((point) => point.x); const ys = drawing.points.map((point) => point.y); const minX = Math.min(...xs); const maxX = Math.max(...xs); const minY = Math.min(...ys); const maxY = Math.max(...ys); const centerX = (minX + maxX) / 2; const centerY = (minY + maxY) / 2; drawing.points = drawing.points.map((point) => ({ x: point.x - centerX, y: point.y - centerY })); drawing.x += centerX; drawing.y += centerY; drawing.bounds = { minX: minX - centerX, minY: minY - centerY, width: Math.max(1, maxX - minX), height: Math.max(1, maxY - minY) }; }
function drawingLabel() { return ({ en: 'Drawing', ru: 'Рисунок', es: 'Dibujo', pt: 'Desenho', zh: '绘图', ar: 'رسم' })[state.language] || 'Drawing'; }

function renderItems(eye = state.activeEye) { const currentEye = eyeState(eye); const floaterLayer = currentEye.elements.floaterLayer; floaterLayer.innerHTML = ''; currentEye.items.forEach((item) => { const el = document.createElement('div'); el.className = 'floater-item'; el.dataset.id = item.id; el.dataset.eye = eye; el.style.left = `${item.x}%`; el.style.top = `${item.y}%`; el.innerHTML = svgForItem(item); el.classList.toggle('selected', currentEye.selection.type === 'item' && item.id === currentEye.selection.id); el.addEventListener('pointerdown', startDragItem); item.element = el; floaterLayer.appendChild(el); }); applyItemTransforms(eye, performance.now()); queueShareUrlSync(); }
function renderDrawings(eye = state.activeEye) { const currentEye = eyeState(eye); const drawLayer = currentEye.elements.drawLayer; drawLayer.innerHTML = ''; currentEye.drawings.forEach((drawing) => { const group = document.createElementNS('http://www.w3.org/2000/svg', 'g'); group.setAttribute('class', `drawing-group${currentEye.selection.type === 'drawing' && currentEye.selection.id === drawing.id ? ' selected' : ''}`); group.dataset.id = drawing.id; group.dataset.eye = eye; group.setAttribute('transform', `translate(${drawing.x} ${drawing.y}) rotate(${drawing.rotation}) scale(${drawing.scale})`); const hit = document.createElementNS('http://www.w3.org/2000/svg', 'path'); hit.setAttribute('d', buildDrawingPath(drawing.points)); hit.setAttribute('fill', 'none'); hit.setAttribute('stroke', 'transparent'); hit.setAttribute('stroke-width', `${Math.max(18, drawing.size * 4)}`); hit.setAttribute('stroke-linecap', 'round'); hit.setAttribute('stroke-linejoin', 'round'); hit.setAttribute('class', 'drawing-hit'); hit.dataset.id = drawing.id; hit.dataset.eye = eye; hit.addEventListener('pointerdown', startDragDrawing); const visible = document.createElementNS('http://www.w3.org/2000/svg', 'path'); visible.setAttribute('d', buildDrawingPath(drawing.points)); visible.setAttribute('fill', 'none'); visible.setAttribute('stroke-linecap', 'round'); visible.setAttribute('stroke-linejoin', 'round'); visible.setAttribute('stroke-width', `${drawing.size * (0.75 + drawing.structure * 0.9)}`); visible.setAttribute('stroke', `rgba(35,35,35,${Math.max(0.08, drawing.alpha * (0.45 + drawing.contrast * 0.85))})`); visible.style.filter = `blur(${drawing.blur}px)`; visible.style.pointerEvents = 'none'; if (currentEye.selection.type === 'drawing' && currentEye.selection.id === drawing.id) { const outline = document.createElementNS('http://www.w3.org/2000/svg', 'rect'); const padding = Math.max(12, drawing.size * 2.5); outline.setAttribute('x', `${drawing.bounds.minX - padding}`); outline.setAttribute('y', `${drawing.bounds.minY - padding}`); outline.setAttribute('width', `${drawing.bounds.width + padding * 2}`); outline.setAttribute('height', `${drawing.bounds.height + padding * 2}`); outline.setAttribute('rx', '18'); outline.setAttribute('fill', 'none'); outline.setAttribute('stroke', 'rgba(17, 24, 39, 0.45)'); outline.setAttribute('stroke-width', '2'); outline.setAttribute('stroke-dasharray', '6 6'); outline.style.pointerEvents = 'none'; group.appendChild(outline); } group.appendChild(hit); group.appendChild(visible); drawLayer.appendChild(group); }); queueShareUrlSync(); }

function updateEyeUi() { controls.activeEyeButtons.forEach((button) => button.classList.toggle('active', button.dataset.eyeTarget === state.activeEye)); controls.previewEyeButtons.forEach((button) => button.classList.toggle('active', button.dataset.previewEyes === state.previewMode)); EYES.forEach((eye) => { const isVisible = state.previewMode === 'both' || state.activeEye === eye; state.eyes[eye].elements.motionLayer?.classList.toggle('hidden-eye', !isVisible); state.eyes[eye].elements.motionLayer?.classList.toggle('active-eye-layer', state.activeEye === eye); }); }
function updateSelectionUi() { const item = selectedItem(); const drawing = selectedDrawing(); const selected = item || drawing; const disabled = !selected; [controls.itemContrast, controls.itemBlur, controls.itemStructure, controls.itemScale, controls.itemRotation, controls.duplicateSelected, controls.deleteSelected].forEach((control) => { control.disabled = disabled; }); if (!selected) { controls.selectionStatus.textContent = t('selectionNone'); return; } const eyeLabel = t(eyeKeyLabel(state.activeEye)); controls.selectionStatus.textContent = `${t('selectionActive')}: ${eyeLabel} · ${item ? t(`preset${item.type.charAt(0).toUpperCase()}${item.type.slice(1)}`) : drawingLabel()}`; controls.itemContrast.value = selected.contrast; controls.itemBlur.value = selected.blur; controls.itemStructure.value = selected.structure; controls.itemScale.value = selected.scale; controls.itemRotation.value = selected.rotation; }
function refreshSelectionStyles() { EYES.forEach((eye) => { eyeState(eye).items.forEach((item) => item.element?.classList.toggle('selected', eyeState(eye).selection.type === 'item' && item.id === eyeState(eye).selection.id)); renderDrawings(eye); }); }
function selectObject(type, id, eye = state.activeEye) { state.activeEye = eye; eyeState(eye).selection = { type, id }; updateEyeUi(); refreshSelectionStyles(); updateSelectionUi(); }
function clearSelection(eye = state.activeEye) { eyeState(eye).selection = { type: null, id: null }; refreshSelectionStyles(); updateSelectionUi(); }
function clearAllSelections() { EYES.forEach((eye) => { state.eyes[eye].selection = { type: null, id: null }; }); refreshSelectionStyles(); updateSelectionUi(); }
function switchActiveEye(eye) { state.activeEye = eye; updateEyeUi(); updateSelectionUi(); refreshSelectionStyles(); }
function addPreset(type) { const currentEye = eyeState(); const item = makeItem(type); currentEye.items.push(item); renderItems(state.activeEye); selectObject('item', item.id, state.activeEye); }
function copySelected() { const item = selectedItem(); if (item) { const { type, rotation, scale, density, contrast, blur, structure } = item; state.clipboard = { objectType: 'item', type, rotation, scale, density, contrast, blur, structure }; return; } const drawing = selectedDrawing(); if (!drawing) return; state.clipboard = { objectType: 'drawing', rotation: drawing.rotation, scale: drawing.scale, contrast: drawing.contrast, blur: drawing.blur, structure: drawing.structure, size: drawing.size, alpha: drawing.alpha, points: drawing.points.map((point) => ({ ...point })) }; }
function pasteSelected() { const currentEye = eyeState(); if (!state.clipboard) return; if (state.clipboard.objectType === 'drawing') { const rect = stageRect(); const drawing = { id: uid(), type: 'drawing', x: rect.width * 0.54 + rand(-24, 24), y: rect.height * 0.54 + rand(-24, 24), rotation: state.clipboard.rotation, scale: state.clipboard.scale, contrast: state.clipboard.contrast, blur: state.clipboard.blur, structure: state.clipboard.structure, size: state.clipboard.size, alpha: state.clipboard.alpha, points: state.clipboard.points.map((point) => ({ ...point })), bounds: { minX: 0, minY: 0, width: 1, height: 1 }, eye: state.activeEye }; normalizeDrawing(drawing); currentEye.drawings.push(drawing); renderDrawings(state.activeEye); selectObject('drawing', drawing.id, state.activeEye); return; } const item = makeItem(state.clipboard.type, 54, 54, { ...state.clipboard, eye: state.activeEye }); item.x += rand(-6, 6); item.y += rand(-6, 6); currentEye.items.push(item); renderItems(state.activeEye); selectObject('item', item.id, state.activeEye); }
function deleteSelected() { const currentEye = eyeState(); if (currentEye.selection.type === 'item') { currentEye.items = currentEye.items.filter((item) => item.id !== currentEye.selection.id); renderItems(state.activeEye); } else if (currentEye.selection.type === 'drawing') { currentEye.drawings = currentEye.drawings.filter((drawing) => drawing.id !== currentEye.selection.id); renderDrawings(state.activeEye); } else return; currentEye.selection = { type: null, id: null }; updateSelectionUi(); }

function startDragItem(event) { if (state.drawingEnabled) return; const eye = event.currentTarget.dataset.eye; const currentEye = eyeState(eye); const item = currentEye.items.find((entry) => entry.id === event.currentTarget.dataset.id); if (!item) return; selectObject('item', item.id, eye); const rect = stageRect(); const currentX = rect.width * (item.x / 100); const currentY = rect.height * (item.y / 100); state.dragging = { eye, type: 'item', id: item.id, pointerId: event.pointerId, dx: event.clientX - rect.left - currentX, dy: event.clientY - rect.top - currentY }; event.currentTarget.classList.add('dragging'); event.currentTarget.setPointerCapture?.(event.pointerId); event.stopPropagation(); }
function startDragDrawing(event) { if (state.drawingEnabled) return; const eye = event.currentTarget.dataset.eye; const currentEye = eyeState(eye); const drawing = currentEye.drawings.find((entry) => entry.id === event.currentTarget.dataset.id); if (!drawing) return; selectObject('drawing', drawing.id, eye); const point = pointerToStage(event, eye); state.dragging = { eye, type: 'drawing', id: drawing.id, pointerId: event.pointerId, dx: point.x - drawing.x, dy: point.y - drawing.y }; event.stopPropagation(); }
function moveDragItem(event) { if (!state.dragging.id) return; const currentEye = eyeState(state.dragging.eye); if (state.dragging.type === 'item') { const item = currentEye.items.find((entry) => entry.id === state.dragging.id); if (!item) return; const rect = stageRect(); const xPx = Math.max(0, Math.min(rect.width, event.clientX - rect.left - state.dragging.dx)); const yPx = Math.max(0, Math.min(rect.height, event.clientY - rect.top - state.dragging.dy)); item.x = (xPx / rect.width) * 100; item.y = (yPx / rect.height) * 100; if (item.element) { item.element.style.left = `${item.x}%`; item.element.style.top = `${item.y}%`; } return; } const drawing = currentEye.drawings.find((entry) => entry.id === state.dragging.id); if (!drawing) return; const point = pointerToStage(event, state.dragging.eye); const rect = stageRect(); drawing.x = Math.max(0, Math.min(rect.width, point.x - state.dragging.dx)); drawing.y = Math.max(0, Math.min(rect.height, point.y - state.dragging.dy)); renderDrawings(state.dragging.eye); }
function stopDragItem() { if (!state.dragging.id) return; if (state.dragging.type === 'item') eyeState(state.dragging.eye).items.find((entry) => entry.id === state.dragging.id)?.element?.classList.remove('dragging'); state.dragging = { eye: null, type: null, id: null, pointerId: null, dx: 0, dy: 0 }; }

function resetScene() { EYES.forEach((eye) => { state.eyes[eye].items = []; state.eyes[eye].drawings = []; state.eyes[eye].selection = { type: null, id: null }; state.eyes[eye].randomTarget = { x: 0, y: 0 }; state.eyes[eye].motionOffset = { x: 0, y: 0 }; state.eyes[eye].motionTarget = { x: 0, y: 0 }; state.eyes[eye].eyeTarget = { x: 0, y: 0 }; state.eyes[eye].elements.motionLayer.style.transform = 'translate(0px, 0px)'; renderItems(eye); renderDrawings(eye); }); updateSelectionUi(); }
function loadDemoScene() { state.eyes.left.items = [makeItem('ring', 32, 40, { eye: 'left' }), makeItem('thread', 54, 56, { eye: 'left' }), makeItem('dot', 43, 65, { eye: 'left' })]; state.eyes.right.items = [makeItem('cobweb', 64, 39, { eye: 'right' }), makeItem('cloud', 33, 61, { eye: 'right' }), makeItem('smudge', 57, 35, { eye: 'right' })]; state.eyes.left.drawings = []; state.eyes.right.drawings = []; EYES.forEach((eye) => renderItems(eye)); selectObject('item', state.eyes.left.items[0]?.id || null, 'left'); }
function pickRandomTarget() { const rect = stageRect(); const maxOffset = Math.min(220, Math.min(rect.width, rect.height) * 0.16) * state.motionIntensity; const sharedTarget = { x: rand(-maxOffset, maxOffset), y: rand(-maxOffset, maxOffset) }; EYES.forEach((eye, index) => { const currentEye = eyeState(eye); const offsetScale = 0.12 + index * 0.02; currentEye.randomTarget.x = Math.max(-maxOffset, Math.min(maxOffset, sharedTarget.x + rand(-maxOffset * offsetScale, maxOffset * offsetScale))); currentEye.randomTarget.y = Math.max(-maxOffset, Math.min(maxOffset, sharedTarget.y + rand(-maxOffset * offsetScale, maxOffset * offsetScale))); }); }
function applyItemTransforms(eye, now) { eyeState(eye).items.forEach((item, index) => { if (!item.element) return; const wobble = Math.sin(now / 1200 + item.driftSeed + index) * 7 * (state.motionRunning ? state.motionIntensity : 0); const lift = Math.cos(now / 1400 + item.driftSeed * 1.6) * 6 * (state.motionRunning ? state.motionIntensity : 0); item.element.style.transform = `translate(-50%, -50%) rotate(${item.rotation + wobble * 0.3}deg) scale(${item.scale}) translate(${wobble}px, ${lift}px)`; item.element.style.opacity = `${Math.max(0.18, Math.min(0.95, 0.35 + item.contrast * 0.9))}`; }); }
function animate(now) { EYES.forEach((eye) => { const currentEye = eyeState(eye); if (state.motionRunning) { if (state.motionMode === 'random') { currentEye.motionTarget.x += (currentEye.randomTarget.x - currentEye.motionTarget.x) * 0.05; currentEye.motionTarget.y += (currentEye.randomTarget.y - currentEye.motionTarget.y) * 0.05; } else { currentEye.motionTarget.x += (currentEye.eyeTarget.x - currentEye.motionTarget.x) * 0.025; currentEye.motionTarget.y += (currentEye.eyeTarget.y - currentEye.motionTarget.y) * 0.025; } } else { currentEye.motionTarget.x += (0 - currentEye.motionTarget.x) * 0.08; currentEye.motionTarget.y += (0 - currentEye.motionTarget.y) * 0.08; } currentEye.motionOffset.x += (currentEye.motionTarget.x - currentEye.motionOffset.x) * 0.06; currentEye.motionOffset.y += (currentEye.motionTarget.y - currentEye.motionOffset.y) * 0.06; currentEye.elements.motionLayer.style.transform = `translate(${currentEye.motionOffset.x}px, ${currentEye.motionOffset.y}px)`; applyItemTransforms(eye, now); }); requestAnimationFrame(animate); }
setInterval(() => { if (state.motionMode === 'random' && state.motionRunning) pickRandomTarget(); }, 2800);

function pointerToStage(event, eye = state.activeEye) { const drawLayer = eyeState(eye).elements.drawLayer; const point = drawLayer.createSVGPoint(); point.x = event.clientX; point.y = event.clientY; const ctm = drawLayer.getScreenCTM(); if (!ctm) { const rect = stageRect(); return { x: event.clientX - rect.left, y: event.clientY - rect.top }; } const local = point.matrixTransform(ctm.inverse()); return { x: local.x, y: local.y }; }
function stageEyeFromEvent(event) { return event.target.closest('[data-eye]')?.dataset.eye || state.activeEye; }
function startDrawing(event) { const clickedInteractive = event.target.closest('.floater-item, .drawing-hit'); const eye = stageEyeFromEvent(event); if (!state.drawingEnabled) { if (!clickedInteractive) { switchActiveEye(eye); clearSelection(eye); } return; } if (clickedInteractive) return; switchActiveEye(eye); const point = pointerToStage(event, eye); state.lastPointer = point; const drawing = createDrawingFromPoint(point); eyeState(eye).drawings.push(drawing); state.drawingPath = drawing; renderDrawings(eye); selectObject('drawing', drawing.id, eye); }
function moveDrawing(event) { if (!state.drawingEnabled || !state.drawingPath) return; const point = pointerToStage(event, state.drawingPath.eye); const last = state.lastPointer; if (!last) return; if (Math.hypot(point.x - last.x, point.y - last.y) < 1.5) return; addPointToDrawing(state.drawingPath, point); state.lastPointer = point; renderDrawings(state.drawingPath.eye); }
function stopDrawing() { if (state.drawingPath?.points.length === 1) { state.drawingPath.points.push({ x: 0.5, y: 0.5 }); normalizeDrawing(state.drawingPath); renderDrawings(state.drawingPath.eye); } state.drawingPath = null; state.lastPointer = null; }

async function disableCamera() {
  if (state.eye.camera?.stop) {
    try { state.eye.camera.stop(); } catch (error) { console.error(error); }
  }
  if (state.eye.stream) {
    state.eye.stream.getTracks().forEach((track) => track.stop());
  }
  cameraFeed.srcObject = null;
  delete controls.cameraStatus.dataset.errorKey;
  state.eye.active = false;
  state.eye.baseEyeLidDistance = null;
  state.eye.faceMesh = null;
  state.eye.camera = null;
  state.eye.stream = null;
  EYES.forEach((eye) => { state.eyes[eye].eyeTarget = { x: 0, y: 0 }; });
  updateCameraStatus();
}

async function enableCamera() {
  if (!window.location.protocol.startsWith('https') && !window.location.hostname.includes('localhost')) { controls.cameraStatus.dataset.errorKey = 'cameraNeedsHttps'; updateCameraStatus(); return false; }
  if (state.eye.active) { delete controls.cameraStatus.dataset.errorKey; updateCameraStatus(); return true; }
  const faceMesh = new FaceMesh({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}` });
  faceMesh.setOptions({ maxNumFaces: 1, refineLandmarks: true, minDetectionConfidence: 0.45, minTrackingConfidence: 0.45 });
  faceMesh.onResults(onFaceResults);
  const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 480, height: 360 }, audio: false }).catch((error) => { console.error(error); return null; });
  if (!stream) { controls.cameraStatus.dataset.errorKey = 'cameraPermissionFailed'; updateCameraStatus(); return false; }
  cameraFeed.srcObject = stream; await cameraFeed.play().catch(() => {});
  const camera = new Camera(cameraFeed, { onFrame: async () => { await faceMesh.send({ image: cameraFeed }); }, width: 480, height: 360 });
  try { await camera.start(); state.eye.faceMesh = faceMesh; state.eye.camera = camera; state.eye.stream = stream; state.eye.active = true; state.eye.baseEyeLidDistance = null; delete controls.cameraStatus.dataset.errorKey; updateCameraStatus(); return true; } catch (error) { console.error(error); stream.getTracks().forEach((track) => track.stop()); cameraFeed.srcObject = null; controls.cameraStatus.dataset.errorKey = 'cameraPermissionFailed'; updateCameraStatus(); return false; }
}

async function syncMotionModeSideEffects() {
  if (state.motionMode === 'eye') {
    const enabled = await enableCamera();
    if (!enabled) {
      state.motionRunning = false;
    }
  } else {
    await disableCamera();
  }
  updateMotionButton();
  updateCameraStatus();
}

function onFaceResults(results) {
  if (state.motionMode !== 'eye' || !state.motionRunning) return;
  if (!results.multiFaceLandmarks?.length) return;

  const rect = stageRect();
  const landmarks = results.multiFaceLandmarks[0];
  const leftUpperEyelid = landmarks[159];
  const leftLowerEyelid = landmarks[145];
  const rightUpperEyelid = landmarks[386];
  const rightLowerEyelid = landmarks[374];
  const leftIris = landmarks[468];
  const rightIris = landmarks[473];

  // Keep the same baseline/sign convention as in the extension repo.
  const leftEyeLidDistance = leftUpperEyelid.y - leftLowerEyelid.y;
  const rightEyeLidDistance = rightUpperEyelid.y - rightLowerEyelid.y;
  const currentEyeLidDistance = (leftEyeLidDistance + rightEyeLidDistance) / 2;

  if (state.eye.baseEyeLidDistance === null) {
    state.eye.baseEyeLidDistance = currentEyeLidDistance;
  }

  const eyeLidDelta = currentEyeLidDistance - state.eye.baseEyeLidDistance;
  const leftEyeWidth = Math.max(0.0001, landmarks[133].x - landmarks[33].x);
  const rightEyeWidth = Math.max(0.0001, landmarks[263].x - landmarks[362].x);
  const leftIrisOffsetX = (leftIris.x - landmarks[33].x) / leftEyeWidth - 0.5;
  const rightIrisOffsetX = (rightIris.x - landmarks[362].x) / rightEyeWidth - 0.5;
  const irisOffsetX = -(leftIrisOffsetX + rightIrisOffsetX) / 2;

  const rawTargetX = irisOffsetX * rect.width * 0.42 * state.motionIntensity;
  const rawTargetY = eyeLidDelta * rect.height * 7.5 * state.motionIntensity;
  const maxX = rect.width * 0.18 * state.motionIntensity;
  const maxY = rect.height * 0.16 * state.motionIntensity;
  const targetX = Math.max(-maxX, Math.min(maxX, rawTargetX));
  const targetY = Math.max(-maxY, Math.min(maxY, rawTargetY));

  EYES.forEach((eye) => {
    state.eyes[eye].eyeTarget.x = targetX;
    state.eyes[eye].eyeTarget.y = targetY;
  });
}

function rerenderSelectedItem() { const item = selectedItem(); if (!item?.element) return; item.element.innerHTML = svgForItem(item); applyItemTransforms(state.activeEye, performance.now()); }
function updateSelectedObject(prop, value) { const item = selectedItem(); if (item) { item[prop] = value; rerenderSelectedItem(); updateSelectionUi(); return; } const drawing = selectedDrawing(); if (!drawing) return; drawing[prop] = value; renderDrawings(state.activeEye); updateSelectionUi(); }
function closeInfoPopover() { controls.eyeTrackingInfoPopover.hidden = true; controls.eyeTrackingInfoButton.setAttribute('aria-expanded', 'false'); }
function toggleInfoPopover() { const willOpen = controls.eyeTrackingInfoPopover.hidden; controls.eyeTrackingInfoPopover.hidden = !willOpen; controls.eyeTrackingInfoButton.setAttribute('aria-expanded', String(willOpen)); }

presetButtons.forEach((button) => button.addEventListener('click', () => addPreset(button.dataset.preset)));
sceneButtons.forEach((button) => button.addEventListener('click', () => { state.scene = button.dataset.scene; applyScene(); }));
motionInputs.forEach((input) => input.addEventListener('change', async () => {
  if (!input.checked) return;
  state.motionMode = input.value;
  if (state.motionMode === 'eye') state.motionRunning = true;
  await syncMotionModeSideEffects();
}));
controls.motionIntensity?.addEventListener('input', (e) => { state.motionIntensity = Number(e.target.value); pickRandomTarget(); });
controls.itemContrast?.addEventListener('input', (e) => updateSelectedObject('contrast', Number(e.target.value)));
controls.itemBlur?.addEventListener('input', (e) => updateSelectedObject('blur', Number(e.target.value)));
controls.itemStructure?.addEventListener('input', (e) => updateSelectedObject('structure', Number(e.target.value)));
controls.itemScale?.addEventListener('input', (e) => updateSelectedObject('scale', Number(e.target.value)));
controls.itemRotation?.addEventListener('input', (e) => updateSelectedObject('rotation', Number(e.target.value)));
controls.brushSize?.addEventListener('input', (e) => { state.brushSize = Number(e.target.value); });
controls.brushAlpha?.addEventListener('input', (e) => { state.brushAlpha = Number(e.target.value); });
controls.drawToggle?.addEventListener('click', () => { state.drawingEnabled = !state.drawingEnabled; controls.drawToggle?.classList.toggle('active', state.drawingEnabled); if (controls.drawToggle) controls.drawToggle.textContent = state.drawingEnabled ? t('drawingEnabled') : t('enableDrawing'); document.body.classList.toggle('drawing-mode', state.drawingEnabled); });
controls.clearDrawings?.addEventListener('click', () => { eyeState().drawings = []; if (activeSelection().type === 'drawing') eyeState().selection = { type: null, id: null }; renderDrawings(state.activeEye); updateSelectionUi(); });
controls.resetScene?.addEventListener('click', resetScene);
controls.toggleMotion?.addEventListener('click', async () => {
  state.motionRunning = !state.motionRunning;
  if (state.motionRunning) {
    if (state.motionMode === 'eye') {
      const enabled = await enableCamera();
      if (!enabled) state.motionRunning = false;
    } else {
      await disableCamera();
      pickRandomTarget();
    }
  } else if (state.motionMode === 'eye') {
    await disableCamera();
  }
  updateMotionButton();
  updateCameraStatus();
});
controls.duplicateSelected?.addEventListener('click', () => { copySelected(); pasteSelected(); });
controls.deleteSelected?.addEventListener('click', deleteSelected);
controls.languageSelect?.addEventListener('change', (event) => { state.language = event.target.value; try { localStorage.setItem('vitro_lang', state.language); } catch(e){} applyTranslations(); });
controls.previewMode?.addEventListener('click', () => { state.focusPreview = !state.focusPreview; document.body.classList.toggle('preview-only', state.focusPreview); if (controls.previewMode) controls.previewMode.textContent = state.focusPreview ? t('exitFocusMode') : t('focusMode'); queueShareUrlSync(); });
controls.fullscreenMode?.addEventListener('click', async () => { try { if (!document.fullscreenElement) await stage.requestFullscreen(); else await document.exitFullscreen(); } catch (error) { console.error(error); } });
controls.shareLink?.addEventListener('click', shareCurrentScene);
controls.downloadPng?.addEventListener('click', downloadCurrentPng);
controls.downloadPdf?.addEventListener('click', downloadCurrentPdf);
controls.activeEyeButtons.forEach((button) => button.addEventListener('click', () => switchActiveEye(button.dataset.eyeTarget)));
controls.previewEyeButtons.forEach((button) => button.addEventListener('click', () => { state.previewMode = button.dataset.previewEyes; updateEyeUi(); }));
controls.eyeTrackingInfoButton?.addEventListener('click', (event) => { event.stopPropagation(); toggleInfoPopover(); });
controls.eyeTrackingInfoButton?.addEventListener('mouseenter', () => { if (controls.eyeTrackingInfoPopover) controls.eyeTrackingInfoPopover.hidden = false; controls.eyeTrackingInfoButton?.setAttribute('aria-expanded', 'true'); });
controls.eyeTrackingInfoButton?.addEventListener('mouseleave', () => { if (controls.eyeTrackingInfoPopover && !controls.eyeTrackingInfoPopover.matches(':hover')) closeInfoPopover(); });
controls.eyeTrackingInfoPopover?.addEventListener('mouseleave', closeInfoPopover);
document.addEventListener('click', (event) => { if (!event.target.closest('.eye-tracking-label') && !event.target.closest('.info-popover')) closeInfoPopover(); });

document.addEventListener('fullscreenchange', () => setTimeout(setViewBox, 50));
stage.addEventListener('pointerdown', (event) => {
  if (!state.drawingEnabled && !event.target.closest('.floater-item, .drawing-hit, .info-popover, .info-button')) {
    clearAllSelections();
  }
  startDrawing(event);
});
stage.addEventListener('pointermove', (event) => { moveDragItem(event); moveDrawing(event); });
window.addEventListener('pointerup', () => { stopDrawing(); stopDragItem(); });
window.addEventListener('resize', setViewBox);
window.addEventListener('keydown', (event) => { const isMac = navigator.platform.toUpperCase().includes('MAC'); const mod = isMac ? event.metaKey : event.ctrlKey; if (mod && event.key.toLowerCase() === 'c') copySelected(); if (mod && event.key.toLowerCase() === 'v') { pasteSelected(); event.preventDefault(); } if ((event.key === 'Delete' || event.key === 'Backspace') && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) deleteSelected(); if (event.key === 'Escape') closeInfoPopover(); });

ensureStageLayers(); populateLanguageSelect(); loadSceneFromUrl(); setViewBox(); pickRandomTarget(); EYES.forEach((eye) => { renderItems(eye); renderDrawings(eye); }); applyScene(); applyTranslations(); controls.motionIntensity.value = String(state.motionIntensity); controls.brushSize.value = String(state.brushSize); controls.brushAlpha.value = String(state.brushAlpha); motionInputs.forEach((input) => { input.checked = input.value === state.motionMode; }); updateEyeUi(); updateMotionButton(); updateShareUrl(); requestAnimationFrame(animate);
