(() => {
  'use strict';

  // ====================================================
  //  Лазерный витреолизис — симулятор
  //  Физика помутнений + модель повреждения окружающих
  //  структур. Калибровка под образовательную реалистичность.
  // ====================================================

  // ---------- i18n ----------
  const LANG_META = {
    en: { label: 'English' },
    ru: { label: 'Русский' },
    es: { label: 'Español' },
    pt: { label: 'Português' },
    zh: { label: '中文' },
    ar: { label: 'العربية' }
  };

  const I18N = {
    en: {
      pageTitle: 'Laser Vitreolysis — Game',
      mainTitle: 'Laser vitreolysis', subTitle: 'YAG simulator',
      navFloaters: 'Floater simulator', navLysis: 'Lysis · game',
      caseLabel: 'Case:', loading: 'Loading…',
      hudTime: 'Time', hudShots: 'Shots', hudScore: 'Score',
      hudTotalEnergy: 'Total energy', hudEfficiency: 'Efficiency',
      panelAnatomy: 'Anatomical axis', depthHint: 'Anteroposterior focus projection',
      energyLabel: 'Pulse energy', energyHint: 'Working range 3–7 mJ. > 8 mJ — high risk.',
      focusLabel: 'Focus depth (Z)', focusHint: '0 = posterior lens capsule, 1 = retina. Mouse wheel and ↑/↓.',
      spotLabel: 'Spot size', spotHint: 'Smaller = higher energy density.',
      convLabel: 'Convergence angle', convHint: 'Larger = narrower depth of focus, sharper aim.',
      eyeStatusTitle: 'Eye status', lensLabel: 'Lens', retinaLabel: 'Retina', floatersLabel: 'Floaters',
      btnNewCase: 'New case', btnSaccade: 'Patient saccade', btnPause: 'Pause', btnResume: 'Resume',
      btnRetryCase: 'Retry case', caseModalTitle: 'Select case',
      hkMouse: 'Mouse', hkMouseAct: 'aim', hkFire: 'LMB', hkFireAct: 'fire',
      hkWheel: 'Wheel', hkFocusAct: 'focus', hkEnergyAct: 'energy',
      hkPauseAct: 'pause', hkSaccadeAct: 'saccade', hkSoundAct: 'sound',
      difEasy: 'Easy', difMedium: 'Medium', difHard: 'Hard',
      case0Name: 'Weiss ring', case0Desc: 'Posterior vitreous detachment. Clear ring-shaped floater in the central zone.',
      case1Name: 'Fibrillar strands', case1Desc: 'Multiple thin collagen fibers. Requires precise focusing and quick reactions.',
      case2Name: 'Cloud-like floaters', case2Desc: 'Diffuse opacities. Resistant to destruction, require increased energy — high risk.',
      case3Name: 'Mixed case', case3Desc: 'Weiss ring + strands + punctate floaters. Standard outpatient encounter.',
      case4Name: 'Severe myodesopsia', case4Desc: 'Multiple floaters of varied nature. For experienced surgeons only.',
      case5Name: 'Mobile floaters', case5Desc: 'Floaters with increased mobility. Anxious patient, frequent saccades.',
      msgCase: 'Case: {name}', msgSoundOff: 'Sound off', msgSoundOn: 'Sound on',
      msgLowEnergy: 'Energy too low — laser does not penetrate',
      msgOverEnergy: 'Safe energy exceeded — avalanche scatter',
      msgLensDmg: 'Posterior capsule damage +{n}%', msgLensBurst: 'POSTERIOR CAPSULE BREACH!',
      msgRetinaBurn: 'Retinal photocoagulation burn +{n}%', msgRetinaSevere: 'Severe retinal burn!',
      msgNotEnough: 'Insufficient energy for destruction', msgDestroyed: 'Floater destroyed (+60)',
      endCataractTitle: 'Traumatic cataract',
      endCataractBody: 'The posterior lens capsule is irreversibly damaged. In a real procedure the patient would require phacoemulsification and IOL implantation.\n\nKey: keep focus no closer than Z = 0.20 to the lens and do not exceed 7 mJ in the anterior third of the vitreous.',
      endRetinaTitle: 'Retinal injury',
      endRetinaBody: 'Retinal laser burns with risk of choroidal hemorrhage and rhegmatogenous detachment.\n\nKey: keep Z > 0.85 — avoid approaching the retina. Lower energy near the posterior pole.',
      endSuccessTitle: 'Vitreolysis complete',
      endSuccessBody: 'All floaters destroyed in {shots} shots. Energy used: {energy} mJ.\nEfficiency: {eff}%.\nSafety bonus: +{safety}.\nSpeed bonus: +{speed}.',
      finalScore: 'Final score: {score}.',
      pauseLabel: 'PAUSED', unitMJ: 'mJ', unitUM: 'µm'
    },
    ru: {
      pageTitle: 'Лазерный витреолизис — Игра',
      mainTitle: 'Лазерный витреолизис', subTitle: 'YAG-симулятор',
      navFloaters: 'Симулятор помутнений', navLysis: 'Лизис · игра',
      caseLabel: 'Случай:', loading: 'Загрузка…',
      hudTime: 'Время', hudShots: 'Выстрелы', hudScore: 'Счёт',
      hudTotalEnergy: 'Энергия за серию', hudEfficiency: 'Эффективность',
      panelAnatomy: 'Анатомическая ось', depthHint: 'Передне-задняя проекция фокуса',
      energyLabel: 'Энергия импульса', energyHint: 'Рабочий диапазон 3–7 мДж. > 8 мДж — высокий риск.',
      focusLabel: 'Глубина фокуса (Z)', focusHint: '0 = задняя капсула хрусталика, 1 = сетчатка. Колесо мыши и ↑/↓.',
      spotLabel: 'Размер пятна', spotHint: 'Меньше — выше плотность энергии.',
      convLabel: 'Угол конвергенции', convHint: 'Больше — уже глубина резкости, точнее прицел.',
      eyeStatusTitle: 'Состояние глаза', lensLabel: 'Хрусталик', retinaLabel: 'Сетчатка', floatersLabel: 'Помутнения',
      btnNewCase: 'Новый случай', btnSaccade: 'Саккада пациента', btnPause: 'Пауза', btnResume: 'Продолжить',
      btnRetryCase: 'Повторить случай', caseModalTitle: 'Выбор случая',
      hkMouse: 'Мышь', hkMouseAct: 'прицел', hkFire: 'ЛКМ', hkFireAct: 'выстрел',
      hkWheel: 'Колесо', hkFocusAct: 'фокус', hkEnergyAct: 'энергия',
      hkPauseAct: 'пауза', hkSaccadeAct: 'саккада', hkSoundAct: 'звук',
      difEasy: 'Лёгкий', difMedium: 'Средний', difHard: 'Тяжёлый',
      case0Name: 'Кольцо Вейса', case0Desc: 'Задняя отслойка стекловидного тела. Чёткое кольцевидное помутнение в центральной зоне.',
      case1Name: 'Фибриллярные нити', case1Desc: 'Множественные тонкие коллагеновые волокна. Требует точной фокусировки и быстрой реакции.',
      case2Name: 'Облакообразные помутнения', case2Desc: 'Диффузные помутнения. Плохо поддаются деструкции, требуют повышенной энергии — высокий риск.',
      case3Name: 'Смешанный случай', case3Desc: 'Кольцо Вейса + волокна + точечные помутнения. Стандартный амбулаторный приём.',
      case4Name: 'Тяжёлая миодезопсия', case4Desc: 'Множественные помутнения разной природы. Только для опытных врачей.',
      case5Name: 'Подвижные помутнения', case5Desc: 'Помутнения с повышенной подвижностью. Пациент тревожный, частые саккады.',
      msgCase: 'Случай: {name}', msgSoundOff: 'Звук выключен', msgSoundOn: 'Звук включён',
      msgLowEnergy: 'Энергия слишком мала — лазер не пробивает',
      msgOverEnergy: 'Превышена безопасная энергия — лавинообразное рассеяние',
      msgLensDmg: 'Повреждение задней капсулы хрусталика +{n}%', msgLensBurst: 'ПРОБОЙ задней капсулы хрусталика!',
      msgRetinaBurn: 'Фотокоагуляционный ожог сетчатки +{n}%', msgRetinaSevere: 'Тяжёлый ожог сетчатки!',
      msgNotEnough: 'Недостаточно энергии для деструкции', msgDestroyed: 'Помутнение разрушено (+60)',
      endCataractTitle: 'Травматическая катаракта',
      endCataractBody: 'Задняя капсула хрусталика необратимо повреждена. В реальной операции пациенту потребуется факоэмульсификация и имплантация ИОЛ.\n\nКлюч: держите фокус не ближе Z = 0.20 от хрусталика и не превышайте 7 мДж в передней трети стекловидного тела.',
      endRetinaTitle: 'Повреждение сетчатки',
      endRetinaBody: 'Лазерные ожоги сетчатки с риском хориоретинального кровоизлияния и регматогенной отслойки.\n\nКлюч: контролируйте Z > 0.85 — не приближайтесь к сетчатке. Снижайте энергию вблизи заднего полюса.',
      endSuccessTitle: 'Витреолизис завершён',
      endSuccessBody: 'Все помутнения разрушены за {shots} выстрелов. Затраченная энергия: {energy} мДж.\nЭффективность: {eff}%.\nБонус безопасности: +{safety}.\nБонус скорости: +{speed}.',
      finalScore: 'Итоговый счёт: {score}.',
      pauseLabel: 'ПАУЗА', unitMJ: 'мДж', unitUM: 'мкм'
    },
    es: {
      pageTitle: 'Vitreólisis láser — Juego',
      mainTitle: 'Vitreólisis láser', subTitle: 'Simulador YAG',
      navFloaters: 'Simulador de miodesopsias', navLysis: 'Vitreólisis · juego',
      caseLabel: 'Caso:', loading: 'Cargando…',
      hudTime: 'Tiempo', hudShots: 'Disparos', hudScore: 'Puntos',
      hudTotalEnergy: 'Energía total', hudEfficiency: 'Eficacia',
      panelAnatomy: 'Eje anatómico', depthHint: 'Proyección anteroposterior del foco',
      energyLabel: 'Energía del impulso', energyHint: 'Rango de trabajo 3–7 mJ. > 8 mJ — riesgo alto.',
      focusLabel: 'Profundidad de foco (Z)', focusHint: '0 = cápsula posterior del cristalino, 1 = retina. Rueda del ratón y ↑/↓.',
      spotLabel: 'Tamaño del punto', spotHint: 'Menor = mayor densidad de energía.',
      convLabel: 'Ángulo de convergencia', convHint: 'Mayor = menor profundidad de foco, puntería más precisa.',
      eyeStatusTitle: 'Estado del ojo', lensLabel: 'Cristalino', retinaLabel: 'Retina', floatersLabel: 'Miodesopsias',
      btnNewCase: 'Nuevo caso', btnSaccade: 'Sacada del paciente', btnPause: 'Pausa', btnResume: 'Reanudar',
      btnRetryCase: 'Reintentar caso', caseModalTitle: 'Seleccionar caso',
      hkMouse: 'Ratón', hkMouseAct: 'apuntar', hkFire: 'BIR', hkFireAct: 'disparar',
      hkWheel: 'Rueda', hkFocusAct: 'foco', hkEnergyAct: 'energía',
      hkPauseAct: 'pausa', hkSaccadeAct: 'sacada', hkSoundAct: 'sonido',
      difEasy: 'Fácil', difMedium: 'Medio', difHard: 'Difícil',
      case0Name: 'Anillo de Weiss', case0Desc: 'Desprendimiento del vítreo posterior. Miodesopsia anular nítida en la zona central.',
      case1Name: 'Hebras fibrilares', case1Desc: 'Múltiples fibras finas de colágeno. Requiere enfoque preciso y reacción rápida.',
      case2Name: 'Miodesopsias nubosas', case2Desc: 'Opacidades difusas. Resistentes a la destrucción, requieren mayor energía — riesgo alto.',
      case3Name: 'Caso mixto', case3Desc: 'Anillo de Weiss + hebras + miodesopsias puntiformes. Consulta ambulatoria estándar.',
      case4Name: 'Miodesopsia grave', case4Desc: 'Múltiples miodesopsias de distinta naturaleza. Solo para cirujanos experimentados.',
      case5Name: 'Miodesopsias móviles', case5Desc: 'Miodesopsias con mayor movilidad. Paciente ansioso, sacadas frecuentes.',
      msgCase: 'Caso: {name}', msgSoundOff: 'Sonido apagado', msgSoundOn: 'Sonido encendido',
      msgLowEnergy: 'Energía demasiado baja — el láser no penetra',
      msgOverEnergy: 'Energía segura excedida — dispersión en avalancha',
      msgLensDmg: 'Daño en la cápsula posterior +{n}%', msgLensBurst: '¡PERFORACIÓN DE LA CÁPSULA POSTERIOR!',
      msgRetinaBurn: 'Quemadura por fotocoagulación retiniana +{n}%', msgRetinaSevere: '¡Quemadura retiniana grave!',
      msgNotEnough: 'Energía insuficiente para la destrucción', msgDestroyed: 'Miodesopsia destruida (+60)',
      endCataractTitle: 'Catarata traumática',
      endCataractBody: 'La cápsula posterior del cristalino está dañada de forma irreversible. En una operación real el paciente requeriría facoemulsificación e implante de LIO.\n\nClave: mantén el foco a no menos de Z = 0,20 del cristalino y no superes 7 mJ en el tercio anterior del vítreo.',
      endRetinaTitle: 'Lesión retiniana',
      endRetinaBody: 'Quemaduras láser en la retina con riesgo de hemorragia coroidea y desprendimiento regmatógeno.\n\nClave: mantén Z > 0,85 — no te acerques a la retina. Reduce la energía cerca del polo posterior.',
      endSuccessTitle: 'Vitreólisis completada',
      endSuccessBody: 'Todas las miodesopsias destruidas en {shots} disparos. Energía usada: {energy} mJ.\nEficacia: {eff}%.\nBono de seguridad: +{safety}.\nBono de velocidad: +{speed}.',
      finalScore: 'Puntuación final: {score}.',
      pauseLabel: 'PAUSA', unitMJ: 'mJ', unitUM: 'µm'
    },
    pt: {
      pageTitle: 'Vitreólise a laser — Jogo',
      mainTitle: 'Vitreólise a laser', subTitle: 'Simulador YAG',
      navFloaters: 'Simulador de moscas volantes', navLysis: 'Vitreólise · jogo',
      caseLabel: 'Caso:', loading: 'Carregando…',
      hudTime: 'Tempo', hudShots: 'Disparos', hudScore: 'Pontos',
      hudTotalEnergy: 'Energia total', hudEfficiency: 'Eficiência',
      panelAnatomy: 'Eixo anatômico', depthHint: 'Projeção anteroposterior do foco',
      energyLabel: 'Energia do pulso', energyHint: 'Faixa de trabalho 3–7 mJ. > 8 mJ — risco alto.',
      focusLabel: 'Profundidade do foco (Z)', focusHint: '0 = cápsula posterior do cristalino, 1 = retina. Roda do mouse e ↑/↓.',
      spotLabel: 'Tamanho do ponto', spotHint: 'Menor = maior densidade de energia.',
      convLabel: 'Ângulo de convergência', convHint: 'Maior = menor profundidade de foco, mira mais precisa.',
      eyeStatusTitle: 'Estado do olho', lensLabel: 'Cristalino', retinaLabel: 'Retina', floatersLabel: 'Moscas volantes',
      btnNewCase: 'Novo caso', btnSaccade: 'Sacada do paciente', btnPause: 'Pausa', btnResume: 'Continuar',
      btnRetryCase: 'Repetir caso', caseModalTitle: 'Selecionar caso',
      hkMouse: 'Mouse', hkMouseAct: 'mirar', hkFire: 'BEM', hkFireAct: 'disparar',
      hkWheel: 'Roda', hkFocusAct: 'foco', hkEnergyAct: 'energia',
      hkPauseAct: 'pausa', hkSaccadeAct: 'sacada', hkSoundAct: 'som',
      difEasy: 'Fácil', difMedium: 'Médio', difHard: 'Difícil',
      case0Name: 'Anel de Weiss', case0Desc: 'Descolamento do vítreo posterior. Mosca volante em anel nítido na zona central.',
      case1Name: 'Fios fibrilares', case1Desc: 'Várias fibras finas de colágeno. Requer foco preciso e reação rápida.',
      case2Name: 'Moscas em nuvem', case2Desc: 'Opacidades difusas. Resistentes à destruição, exigem mais energia — risco alto.',
      case3Name: 'Caso misto', case3Desc: 'Anel de Weiss + fios + moscas puntiformes. Consulta ambulatorial padrão.',
      case4Name: 'Miodesopsia grave', case4Desc: 'Várias moscas de naturezas diferentes. Apenas para cirurgiões experientes.',
      case5Name: 'Moscas móveis', case5Desc: 'Moscas com mobilidade aumentada. Paciente ansioso, sacadas frequentes.',
      msgCase: 'Caso: {name}', msgSoundOff: 'Som desligado', msgSoundOn: 'Som ligado',
      msgLowEnergy: 'Energia muito baixa — o laser não penetra',
      msgOverEnergy: 'Energia segura excedida — dispersão em avalanche',
      msgLensDmg: 'Dano na cápsula posterior +{n}%', msgLensBurst: 'RUPTURA DA CÁPSULA POSTERIOR!',
      msgRetinaBurn: 'Queimadura fotocoagulativa da retina +{n}%', msgRetinaSevere: 'Queimadura retiniana grave!',
      msgNotEnough: 'Energia insuficiente para a destruição', msgDestroyed: 'Mosca destruída (+60)',
      endCataractTitle: 'Catarata traumática',
      endCataractBody: 'A cápsula posterior do cristalino está irreversivelmente danificada. Numa operação real o paciente precisaria de facoemulsificação e implante de LIO.\n\nChave: mantenha o foco a no mínimo Z = 0,20 do cristalino e não ultrapasse 7 mJ no terço anterior do vítreo.',
      endRetinaTitle: 'Lesão retiniana',
      endRetinaBody: 'Queimaduras laser na retina com risco de hemorragia coroidal e descolamento regmatogênico.\n\nChave: mantenha Z > 0,85 — não se aproxime da retina. Reduza a energia perto do polo posterior.',
      endSuccessTitle: 'Vitreólise concluída',
      endSuccessBody: 'Todas as moscas destruídas em {shots} disparos. Energia usada: {energy} mJ.\nEficiência: {eff}%.\nBônus de segurança: +{safety}.\nBônus de velocidade: +{speed}.',
      finalScore: 'Pontuação final: {score}.',
      pauseLabel: 'PAUSA', unitMJ: 'mJ', unitUM: 'µm'
    },
    zh: {
      pageTitle: '激光玻璃体消融 — 游戏',
      mainTitle: '激光玻璃体消融', subTitle: 'YAG 模拟器',
      navFloaters: '飞蚊症模拟器', navLysis: '玻璃体消融 · 游戏',
      caseLabel: '病例：', loading: '加载中…',
      hudTime: '时间', hudShots: '发射数', hudScore: '得分',
      hudTotalEnergy: '总能量', hudEfficiency: '效率',
      panelAnatomy: '解剖轴', depthHint: '前后焦点投影',
      energyLabel: '脉冲能量', energyHint: '工作范围 3–7 mJ。> 8 mJ — 高风险。',
      focusLabel: '焦点深度 (Z)', focusHint: '0 = 晶状体后囊，1 = 视网膜。鼠标滚轮和 ↑/↓。',
      spotLabel: '光斑尺寸', spotHint: '更小 = 能量密度更高。',
      convLabel: '会聚角', convHint: '更大 = 景深更窄，瞄准更精确。',
      eyeStatusTitle: '眼部状态', lensLabel: '晶状体', retinaLabel: '视网膜', floatersLabel: '飞蚊',
      btnNewCase: '新病例', btnSaccade: '患者眼跳', btnPause: '暂停', btnResume: '继续',
      btnRetryCase: '重试病例', caseModalTitle: '选择病例',
      hkMouse: '鼠标', hkMouseAct: '瞄准', hkFire: '左键', hkFireAct: '发射',
      hkWheel: '滚轮', hkFocusAct: '对焦', hkEnergyAct: '能量',
      hkPauseAct: '暂停', hkSaccadeAct: '眼跳', hkSoundAct: '声音',
      difEasy: '简单', difMedium: '中等', difHard: '困难',
      case0Name: '魏氏环', case0Desc: '后玻璃体脱离。中央区清晰的环形飞蚊。',
      case1Name: '纤维丝', case1Desc: '多条细胶原纤维。需要精确对焦和快速反应。',
      case2Name: '云雾状飞蚊', case2Desc: '弥漫性混浊。难以破坏，需要更高能量 — 高风险。',
      case3Name: '混合病例', case3Desc: '魏氏环 + 纤维丝 + 点状飞蚊。标准门诊就诊。',
      case4Name: '严重飞蚊症', case4Desc: '多种性质的多处飞蚊。仅供经验丰富的术者。',
      case5Name: '高活动飞蚊', case5Desc: '高活动度飞蚊。患者紧张，频繁眼跳。',
      msgCase: '病例：{name}', msgSoundOff: '声音已关闭', msgSoundOn: '声音已开启',
      msgLowEnergy: '能量过低 — 激光无法穿透',
      msgOverEnergy: '超过安全能量 — 雪崩式散射',
      msgLensDmg: '后囊损伤 +{n}%', msgLensBurst: '后囊穿孔！',
      msgRetinaBurn: '视网膜光凝灼伤 +{n}%', msgRetinaSevere: '严重视网膜灼伤！',
      msgNotEnough: '能量不足以破坏', msgDestroyed: '飞蚊已破坏（+60）',
      endCataractTitle: '外伤性白内障',
      endCataractBody: '晶状体后囊不可逆损伤。在真实手术中患者将需要超声乳化术和人工晶状体植入。\n\n关键：保持焦点距晶状体不近于 Z = 0.20，玻璃体前三分之一区域不要超过 7 mJ。',
      endRetinaTitle: '视网膜损伤',
      endRetinaBody: '视网膜激光灼伤伴脉络膜出血和孔源性脱离风险。\n\n关键：保持 Z > 0.85 — 不要接近视网膜。在后极附近降低能量。',
      endSuccessTitle: '玻璃体消融完成',
      endSuccessBody: '在 {shots} 次发射中破坏了所有飞蚊。使用能量：{energy} mJ。\n效率：{eff}%。\n安全奖励：+{safety}。\n速度奖励：+{speed}。',
      finalScore: '最终得分：{score}。',
      pauseLabel: '暂停', unitMJ: 'mJ', unitUM: 'µm'
    },
    ar: {
      pageTitle: 'استئصال الزجاجي بالليزر — لعبة',
      mainTitle: 'استئصال الزجاجي بالليزر', subTitle: 'محاكي YAG',
      navFloaters: 'محاكي عوائم العين', navLysis: 'استئصال الزجاجي · لعبة',
      caseLabel: 'الحالة:', loading: 'جارٍ التحميل…',
      hudTime: 'الوقت', hudShots: 'الطلقات', hudScore: 'النقاط',
      hudTotalEnergy: 'إجمالي الطاقة', hudEfficiency: 'الكفاءة',
      panelAnatomy: 'المحور التشريحي', depthHint: 'الإسقاط الأمامي الخلفي للبؤرة',
      energyLabel: 'طاقة النبضة', energyHint: 'المدى المعتاد 3–7 مج. > 8 مج — خطر مرتفع.',
      focusLabel: 'عمق البؤرة (Z)', focusHint: '0 = المحفظة الخلفية للعدسة، 1 = الشبكية. عجلة الفأرة و ↑/↓.',
      spotLabel: 'حجم البقعة', spotHint: 'أصغر = كثافة طاقة أعلى.',
      convLabel: 'زاوية التقارب', convHint: 'أكبر = عمق ميدان أضيق، تصويب أدق.',
      eyeStatusTitle: 'حالة العين', lensLabel: 'العدسة', retinaLabel: 'الشبكية', floatersLabel: 'العوامات',
      btnNewCase: 'حالة جديدة', btnSaccade: 'حركة سريعة للمريض', btnPause: 'إيقاف مؤقت', btnResume: 'استئناف',
      btnRetryCase: 'إعادة الحالة', caseModalTitle: 'اختر حالة',
      hkMouse: 'الفأرة', hkMouseAct: 'تصويب', hkFire: 'يسار', hkFireAct: 'إطلاق',
      hkWheel: 'العجلة', hkFocusAct: 'البؤرة', hkEnergyAct: 'الطاقة',
      hkPauseAct: 'إيقاف', hkSaccadeAct: 'حركة', hkSoundAct: 'صوت',
      difEasy: 'سهل', difMedium: 'متوسط', difHard: 'صعب',
      case0Name: 'حلقة فايس', case0Desc: 'انفصال الزجاجي الخلفي. عتامة حلقية واضحة في المنطقة المركزية.',
      case1Name: 'خيوط ليفية', case1Desc: 'عدة ألياف كولاجينية رفيعة. تتطلب تركيزًا دقيقًا وردة فعل سريعة.',
      case2Name: 'عوائم سحابية', case2Desc: 'عتامات منتشرة. مقاومة للتدمير وتتطلب طاقة أعلى — خطر مرتفع.',
      case3Name: 'حالة مختلطة', case3Desc: 'حلقة فايس + خيوط + عوائم نقطية. زيارة عيادة قياسية.',
      case4Name: 'عوامات شديدة', case4Desc: 'عدة عوامات بطبيعة متنوعة. للجراحين ذوي الخبرة فقط.',
      case5Name: 'عوامات متحركة', case5Desc: 'عوامات بحركة مرتفعة. مريض قلق مع حركات عين متكررة.',
      msgCase: 'الحالة: {name}', msgSoundOff: 'الصوت متوقف', msgSoundOn: 'الصوت مفعَّل',
      msgLowEnergy: 'الطاقة منخفضة جدًا — الليزر لا يخترق',
      msgOverEnergy: 'تم تجاوز الطاقة الآمنة — تشتت ثلجي',
      msgLensDmg: 'تلف في المحفظة الخلفية +{n}٪', msgLensBurst: 'ثقب في المحفظة الخلفية!',
      msgRetinaBurn: 'حرق بالتخثر الضوئي للشبكية +{n}٪', msgRetinaSevere: 'حرق شديد في الشبكية!',
      msgNotEnough: 'الطاقة غير كافية للتدمير', msgDestroyed: 'تم تدمير العوامة (+60)',
      endCataractTitle: 'إعتام عدسة رضحي',
      endCataractBody: 'تلف غير قابل للإصلاح في المحفظة الخلفية للعدسة. في عملية حقيقية سيحتاج المريض إلى استحلاب العدسة وزرع عدسة داخل العين.\n\nالمفتاح: حافظ على البؤرة على بُعد لا يقل عن Z = 0.20 من العدسة ولا تتجاوز 7 مج في الثلث الأمامي للزجاجي.',
      endRetinaTitle: 'إصابة الشبكية',
      endRetinaBody: 'حروق ليزرية في الشبكية مع خطر النزف المشيمي والانفصال المسيل.\n\nالمفتاح: احفظ Z > 0.85 — لا تقترب من الشبكية. قلل الطاقة قرب القطب الخلفي.',
      endSuccessTitle: 'اكتمل استئصال الزجاجي',
      endSuccessBody: 'تم تدمير جميع العوامات في {shots} طلقات. الطاقة المستخدمة: {energy} مج.\nالكفاءة: {eff}٪.\nمكافأة الأمان: +{safety}.\nمكافأة السرعة: +{speed}.',
      finalScore: 'النتيجة النهائية: {score}.',
      pauseLabel: 'إيقاف مؤقت', unitMJ: 'مج', unitUM: 'ميكم'
    }
  };

  let currentLang = (function() {
    try { const s = localStorage.getItem('vitro_lang'); if (s && LANG_META[s]) return s; } catch(e){}
    return 'en';
  })();

  function t(key, params) {
    let str = (I18N[currentLang] && I18N[currentLang][key]) || I18N.en[key] || key;
    if (params) for (const k in params) str = str.split('{' + k + '}').join(params[k]);
    return str;
  }

  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(node => {
      node.textContent = t(node.dataset.i18n);
    });
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.toggle('rtl', currentLang === 'ar');
    document.title = t('pageTitle');
    if (state && state.currentCaseIdx !== undefined && CASES[state.currentCaseIdx]) {
      const c = CASES[state.currentCaseIdx];
      const cn = document.getElementById('caseName');
      const cd = document.getElementById('caseDesc');
      if (cn) cn.textContent = t(c.nameKey);
      if (cd) cd.textContent = t(c.descKey);
    }
    if (typeof pauseBtn !== 'undefined' && state) {
      pauseBtn.textContent = state.paused ? t('btnResume') : t('btnPause');
    }
    if (typeof energyVal !== 'undefined' && state) {
      energyVal.textContent = state.energy.toFixed(1) + ' ' + t('unitMJ');
      spotVal.textContent = state.spot + ' ' + t('unitUM');
      totalEnergyEl.textContent = state.totalEnergy.toFixed(1) + ' ' + t('unitMJ');
    }
  }

  // ---------- DOM ----------
  const $ = (id) => document.getElementById(id);
  const fundus = $('fundusCanvas');
  const fctx = fundus.getContext('2d');
  const depth = $('depthCanvas');
  const dctx = depth.getContext('2d');

  const energyInput = $('energy');
  const focusInput = $('focus');
  const spotInput = $('spot');
  const convInput = $('convergence');

  const energyVal = $('energyVal');
  const focusVal = $('focusVal');
  const spotVal = $('spotVal');
  const convVal = $('convVal');

  const timeEl = $('time');
  const shotsEl = $('shots');
  const scoreEl = $('score');
  const totalEnergyEl = $('totalEnergy');
  const efficiencyEl = $('efficiency');

  const lensBar = $('lensBar');
  const retinaBar = $('retinaBar');
  const floatersBar = $('floatersBar');
  const lensPct = $('lensPct');
  const retinaPct = $('retinaPct');
  const floatersCount = $('floatersCount');

  const alertsEl = $('alerts');
  const caseName = $('caseName');
  const caseDesc = $('caseDesc');

  const newCaseBtn = $('newCaseBtn');
  const saccadeBtn = $('saccadeBtn');
  const pauseBtn = $('pauseBtn');

  const modal = $('modal');
  const modalTitle = $('modalTitle');
  const modalBody = $('modalBody');
  const modalRetry = $('modalRetry');
  const modalNext = $('modalNext');

  const caseModal = $('caseModal');
  const caseList = $('caseList');

  const W = fundus.width, H = fundus.height;
  const CX = W / 2, CY = H / 2;
  const R = W / 2 - 6;

  // ---------- Аудио (Web Audio API, без внешних файлов) ----------
  let audioCtx = null, masterGain = null, soundMuted = false;
  const MASTER_VOL = 0.35;

  function ensureAudio() {
    if (soundMuted) return false;
    if (!audioCtx) {
      try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return false;
        audioCtx = new Ctx();
        masterGain = audioCtx.createGain();
        masterGain.gain.value = MASTER_VOL;
        masterGain.connect(audioCtx.destination);
      } catch (e) { return false; }
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return true;
  }

  function playYagShot(energy) {
    if (!ensureAudio()) return;
    const t = audioCtx.currentTime;

    // Щелчок плазмы — короткий шумовой импульс через полосовой фильтр
    const sr = audioCtx.sampleRate;
    const dur = 0.05;
    const buf = audioCtx.createBuffer(1, Math.floor(sr * dur), sr);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const env = Math.exp(-i / data.length * 7);
      data[i] = (Math.random() * 2 - 1) * env;
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = buf;
    const bpf = audioCtx.createBiquadFilter();
    bpf.type = 'bandpass';
    bpf.frequency.value = 2800;
    bpf.Q.value = 2.4;
    const ng = audioCtx.createGain();
    ng.gain.value = 0.75;
    noise.connect(bpf); bpf.connect(ng); ng.connect(masterGain);
    noise.start(t);

    // Низкий «удар» — короткий sine-свип
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.10);
    const og = audioCtx.createGain();
    const thudVol = Math.max(0.10, Math.min(0.45, 0.10 + energy * 0.035));
    og.gain.setValueAtTime(thudVol, t);
    og.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
    osc.connect(og); og.connect(masterGain);
    osc.start(t); osc.stop(t + 0.15);
  }

  function playDestroyPop() {
    if (!ensureAudio()) return;
    const t = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(720, t);
    osc.frequency.exponentialRampToValueAtTime(280, t + 0.14);
    const g = audioCtx.createGain();
    g.gain.setValueAtTime(0.22, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
    osc.connect(g); g.connect(masterGain);
    osc.start(t); osc.stop(t + 0.17);
  }

  function playReadyBlip() {
    if (!ensureAudio()) return;
    const t = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 1500;
    const g = audioCtx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.05, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.045);
    osc.connect(g); g.connect(masterGain);
    osc.start(t); osc.stop(t + 0.05);
  }

  function playWarningBeep() {
    if (!ensureAudio()) return;
    const t = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    osc.type = 'square';
    osc.frequency.value = 880;
    const g = audioCtx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.13, t + 0.005);
    g.gain.setValueAtTime(0.13, t + 0.08);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    osc.connect(g); g.connect(masterGain);
    osc.start(t); osc.stop(t + 0.13);
  }

  function playDangerBeep() {
    if (!ensureAudio()) return;
    const t = audioCtx.currentTime;
    for (let i = 0; i < 3; i++) {
      const osc = audioCtx.createOscillator();
      osc.type = 'square';
      osc.frequency.value = 1250;
      const g = audioCtx.createGain();
      const ts = t + i * 0.11;
      g.gain.setValueAtTime(0, ts);
      g.gain.linearRampToValueAtTime(0.20, ts + 0.005);
      g.gain.setValueAtTime(0.20, ts + 0.045);
      g.gain.exponentialRampToValueAtTime(0.001, ts + 0.075);
      osc.connect(g); g.connect(masterGain);
      osc.start(ts); osc.stop(ts + 0.085);
    }
  }

  function playSuccessChime() {
    if (!ensureAudio()) return;
    const t = audioCtx.currentTime;
    const freqs = [523, 659, 784, 1047];
    freqs.forEach((f, i) => {
      const osc = audioCtx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = f;
      const g = audioCtx.createGain();
      const ts = t + i * 0.12;
      g.gain.setValueAtTime(0, ts);
      g.gain.linearRampToValueAtTime(0.18, ts + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, ts + 0.5);
      osc.connect(g); g.connect(masterGain);
      osc.start(ts); osc.stop(ts + 0.55);
    });
  }

  function playFailureTone() {
    if (!ensureAudio()) return;
    const t = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.8);
    const g = audioCtx.createGain();
    g.gain.setValueAtTime(0.22, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.9);
    osc.connect(g); g.connect(masterGain);
    osc.start(t); osc.stop(t + 1.0);
  }

  function toggleMute() {
    soundMuted = !soundMuted;
    if (audioCtx) masterGain.gain.value = soundMuted ? 0 : MASTER_VOL;
  }

  // ---------- Утилиты ----------
  const rand = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const dist2 = (x1, y1, x2, y2) => { const dx = x1 - x2, dy = y1 - y2; return dx*dx + dy*dy; };

  function mulberry32(seed) {
    return function() {
      let t = seed += 0x6D2B79F5;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // ---------- Клинические случаи ----------
  const CASES = [
    { nameKey: 'case0Name', descKey: 'case0Desc', difficulty: 'easy',
      gen: () => generateFloaters({ weiss: 1, fibrillar: 0, cloud: 0, punctate: 3 }) },
    { nameKey: 'case1Name', descKey: 'case1Desc', difficulty: 'medium',
      gen: () => generateFloaters({ weiss: 0, fibrillar: 3, cloud: 0, punctate: 6 }) },
    { nameKey: 'case2Name', descKey: 'case2Desc', difficulty: 'medium',
      gen: () => generateFloaters({ weiss: 0, fibrillar: 0, cloud: 3, punctate: 4 }) },
    { nameKey: 'case3Name', descKey: 'case3Desc', difficulty: 'medium',
      gen: () => generateFloaters({ weiss: 1, fibrillar: 2, cloud: 1, punctate: 8 }) },
    { nameKey: 'case4Name', descKey: 'case4Desc', difficulty: 'hard',
      gen: () => generateFloaters({ weiss: 1, fibrillar: 4, cloud: 2, punctate: 14 }) },
    { nameKey: 'case5Name', descKey: 'case5Desc', difficulty: 'hard',
      gen: () => generateFloaters({ weiss: 0, fibrillar: 3, cloud: 1, punctate: 10 }, { mobile: true }) },
  ];

  // ---------- Помутнения ----------
  function placeInField(maxR = 0.78) {
    const r = Math.sqrt(Math.random()) * maxR;
    const a = Math.random() * Math.PI * 2;
    return { x: Math.cos(a) * r, y: Math.sin(a) * r };
  }

  function generateFloaters(counts, opts = {}) {
    const mobility = opts.mobile ? 2.5 : 1;
    const out = [];
    let id = 0;
    const add = (f) => { f.id = id++; f.maxHp = f.hp; out.push(f); };

    for (let i = 0; i < (counts.weiss || 0); i++) {
      const p = placeInField(0.5);
      add({
        type: 'weiss',
        x: p.x, y: p.y,
        z: rand(0.35, 0.65),
        size: rand(0.11, 0.17),
        rotation: rand(0, Math.PI * 2),
        tilt: rand(0.5, 0.95),
        opacity: rand(0.6, 0.85),
        drift: { x: rand(-0.015, 0.015) * mobility, y: rand(0.005, 0.025) * mobility },
        hp: 100,
        threshold: 2.5,
      });
    }
    for (let i = 0; i < (counts.fibrillar || 0); i++) {
      const p = placeInField(0.75);
      add({
        type: 'fibrillar',
        x: p.x, y: p.y,
        z: rand(0.30, 0.70),
        size: rand(0.14, 0.26),
        rotation: rand(0, Math.PI * 2),
        opacity: rand(0.45, 0.7),
        drift: { x: rand(-0.04, 0.04) * mobility, y: rand(0.005, 0.025) * mobility },
        hp: 55,
        threshold: 2.0,
        wave: rand(0, Math.PI * 2),
      });
    }
    for (let i = 0; i < (counts.cloud || 0); i++) {
      const p = placeInField(0.7);
      add({
        type: 'cloud',
        x: p.x, y: p.y,
        z: rand(0.30, 0.70),
        size: rand(0.18, 0.30),
        rotation: rand(0, Math.PI * 2),
        opacity: rand(0.25, 0.45),
        drift: { x: rand(-0.012, 0.012) * mobility, y: rand(0.003, 0.018) * mobility },
        hp: 140,
        threshold: 3.5,
      });
    }
    for (let i = 0; i < (counts.punctate || 0); i++) {
      const p = placeInField(0.82);
      add({
        type: 'punctate',
        x: p.x, y: p.y,
        z: rand(0.25, 0.75),
        size: rand(0.018, 0.045),
        rotation: 0,
        opacity: rand(0.55, 0.9),
        drift: { x: rand(-0.05, 0.05) * mobility, y: rand(0.008, 0.04) * mobility },
        hp: 28,
        threshold: 1.8,
      });
    }
    return out;
  }

  // ---------- Состояние ----------
  const state = {
    floaters: [],
    initialCount: 0,
    aim: { x: CX, y: CY },
    focusZ: 0.5,
    energy: 3.0,
    spot: 8,
    convergence: 16,
    lensDamage: 0,
    retinaDamage: 0,
    shots: 0,
    score: 0,
    totalEnergy: 0,
    startTime: 0,
    elapsed: 0,
    paused: false,
    gameOver: false,
    saccade: { vx: 0, vy: 0, t: 0, decay: 0.88 },
    cooldown: 0,
    pulses: [],
    debris: [],
    burns: [],
    currentCaseIdx: 0,
    flash: 0,
  };

  // ---------- Ввод ----------
  fundus.addEventListener('mousemove', (e) => {
    const rect = fundus.getBoundingClientRect();
    state.aim.x = (e.clientX - rect.left) * (W / rect.width);
    state.aim.y = (e.clientY - rect.top) * (H / rect.height);
  });

  fundus.addEventListener('mousedown', (e) => {
    if (e.button === 0) fire();
  });

  fundus.addEventListener('wheel', (e) => {
    e.preventDefault();
    const dz = (e.deltaY > 0 ? -1 : 1) * 0.015;
    setFocus(state.focusZ + dz);
  }, { passive: false });

  document.addEventListener('keydown', (e) => {
    if (modal && !modal.classList.contains('hidden')) return;
    if (caseModal && !caseModal.classList.contains('hidden')) return;

    if (e.code === 'Space') { e.preventDefault(); fire(); }
    else if (e.key >= '1' && e.key <= '9') {
      const v = parseFloat(e.key);
      setEnergy(v);
    } else if (e.key === 'p' || e.key === 'P') togglePause();
    else if (e.key === 's' || e.key === 'S') triggerSaccade(1);
    else if (e.key === 'ArrowUp') { e.preventDefault(); setFocus(state.focusZ + 0.02); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setFocus(state.focusZ - 0.02); }
    else if (e.key === 'ArrowRight') setEnergy(state.energy + 0.5);
    else if (e.key === 'ArrowLeft') setEnergy(state.energy - 0.5);
    else if (e.key === 'm' || e.key === 'M') {
      toggleMute();
      alert_('info', soundMuted ? t('msgSoundOff') : t('msgSoundOn'));
    }
  });

  function setEnergy(v) {
    state.energy = clamp(parseFloat(v), 0.5, 10);
    energyInput.value = state.energy;
    energyVal.textContent = state.energy.toFixed(1) + ' ' + t('unitMJ');
  }
  function setFocus(v) {
    state.focusZ = clamp(parseFloat(v), 0, 1);
    focusInput.value = state.focusZ;
    focusVal.textContent = state.focusZ.toFixed(2);
  }
  function setSpot(v) {
    state.spot = parseInt(v);
    spotInput.value = state.spot;
    spotVal.textContent = state.spot + ' ' + t('unitUM');
  }
  function setConv(v) {
    state.convergence = parseInt(v);
    convInput.value = state.convergence;
    convVal.textContent = state.convergence + '°';
  }

  energyInput.addEventListener('input', () => setEnergy(energyInput.value));
  focusInput.addEventListener('input', () => setFocus(focusInput.value));
  spotInput.addEventListener('input', () => setSpot(spotInput.value));
  convInput.addEventListener('input', () => setConv(convInput.value));

  newCaseBtn.addEventListener('click', () => showCasePicker());
  saccadeBtn.addEventListener('click', () => triggerSaccade(1.0));
  pauseBtn.addEventListener('click', togglePause);

  modalRetry.addEventListener('click', () => { modal.classList.add('hidden'); startCase(state.currentCaseIdx); });
  modalNext.addEventListener('click', () => { modal.classList.add('hidden'); showCasePicker(); });

  function togglePause() {
    if (state.gameOver) return;
    state.paused = !state.paused;
    pauseBtn.textContent = state.paused ? t('btnResume') : t('btnPause');
  }

  function triggerSaccade(strength = 1) {
    state.saccade.vx = rand(-1, 1) * 0.45 * strength;
    state.saccade.vy = rand(-1, 1) * 0.45 * strength;
    state.saccade.t = 0.5;
  }

  // ---------- Алёрты ----------
  function alert_(level, msg) {
    const el = document.createElement('div');
    el.className = 'alert ' + level;
    el.textContent = msg;
    alertsEl.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.3s';
      setTimeout(() => el.remove(), 300);
    }, 2600);
    while (alertsEl.children.length > 5) alertsEl.removeChild(alertsEl.firstChild);
  }

  // ---------- Выстрел ----------
  function fire() {
    if (state.paused || state.gameOver) return;
    if (state.cooldown > 0) return;

    state.shots++;
    state.cooldown = 0.32;

    // Прицел в нормированных координатах поля
    const fx = (state.aim.x - CX) / R;
    const fy = (state.aim.y - CY) / R;
    const fz = state.focusZ;
    const energy = state.energy;
    state.totalEnergy += energy;

    // Эффект пациентского движения смещает реальный фокус относительно прицела
    const sacBlur = Math.hypot(state.saccade.vx, state.saccade.vy);
    const aimError = sacBlur * 0.06;
    const actualFx = fx + rand(-aimError, aimError);
    const actualFy = fy + rand(-aimError, aimError);

    // Импульс для рендера
    state.pulses.push({
      x: state.aim.x, y: state.aim.y,
      energy, age: 0, life: 0.42,
    });
    state.flash = 0.25;
    playYagShot(energy);

    // ===== Модель повреждения окружающих структур =====
    // Z = 0 — задняя капсула хрусталика, Z = 1 — сетчатка
    const distFromLens = fz;            // ближе к 0 — ближе к хрусталику
    const distFromRetina = 1 - fz;      // ближе к 0 — ближе к сетчатке

    // Конвергенция влияет на глубину резкости и зону повреждения
    // Больше угол — уже фокальная зона — точнее, но требует точной Z
    const convFactor = state.convergence / 16; // 1.0 при 16°
    const focalSpread = 0.08 / convFactor;     // эффективная зона энергии по Z

    // Безопасные зоны зависят от энергии и конвергенции
    const lensDangerZ = 0.10 + (energy > 5 ? (energy - 5) * 0.012 : 0);
    const retinaDangerZ = 0.10 + (energy > 5 ? (energy - 5) * 0.014 : 0);

    let lensDmg = 0, retinaDmg = 0;
    let burnAtRetina = false;
    let lensBurst = false;

    // Прямой удар по хрусталику
    if (distFromLens < lensDangerZ) {
      const proximity = 1 - distFromLens / lensDangerZ;
      lensDmg = energy * proximity * 6.5;
      if (distFromLens < 0.04) {
        lensDmg += energy * 1.8;
        lensBurst = true;
      }
    } else if (distFromLens < lensDangerZ + focalSpread && energy > 5.5) {
      // Близкая зона разряда: высокая энергия передаётся хрусталику
      const proximity = 1 - (distFromLens - lensDangerZ) / focalSpread;
      lensDmg = (energy - 5.5) * proximity * 1.8;
    }

    // Прямой удар по сетчатке
    if (distFromRetina < retinaDangerZ) {
      const proximity = 1 - distFromRetina / retinaDangerZ;
      retinaDmg = energy * proximity * 8.5;
      burnAtRetina = true;
      if (distFromRetina < 0.05) {
        retinaDmg += energy * 2.5;
      }
    } else if (distFromRetina < retinaDangerZ + focalSpread && energy > 5.5) {
      const proximity = 1 - (distFromRetina - retinaDangerZ) / focalSpread;
      retinaDmg = (energy - 5.5) * proximity * 2.5;
    }

    // Глобальное рассеяние при сверхвысокой энергии
    if (energy > 8.5) {
      const excess = energy - 8.5;
      retinaDmg += excess * 0.9;
      lensDmg += excess * 0.4;
    }
    if (energy > 9.5) {
      alert_('danger', t('msgOverEnergy'));
    }

    // Низкая энергия — выстрел в пустоту
    if (energy < 1.2) {
      alert_('warn', t('msgLowEnergy'));
    }

    // Запись ожогов на сетчатке для визуализации
    if (burnAtRetina) {
      state.burns.push({
        x: state.aim.x + rand(-12, 12),
        y: state.aim.y + rand(-12, 12),
        r: 8 + energy * 1.6,
        a: 0.9,
        decay: 0.3,
      });
    }

    state.lensDamage = clamp(state.lensDamage + lensDmg, 0, 100);
    state.retinaDamage = clamp(state.retinaDamage + retinaDmg, 0, 100);

    if (lensDmg > 2) { alert_('warn', t('msgLensDmg', { n: lensDmg.toFixed(1) })); playWarningBeep(); }
    if (lensBurst) { alert_('danger', t('msgLensBurst')); playDangerBeep(); }
    if (retinaDmg > 2 && !lensBurst) { alert_('warn', t('msgRetinaBurn', { n: retinaDmg.toFixed(1) })); playWarningBeep(); }
    if (retinaDmg > 6) { alert_('danger', t('msgRetinaSevere')); playDangerBeep(); }

    // ===== Воздействие на помутнения =====
    let hitAny = false;

    for (const f of state.floaters) {
      if (f.hp <= 0) continue;

      const dx = f.x - actualFx;
      const dy = f.y - actualFy;
      const dz = f.z - fz;
      const xyDist = Math.sqrt(dx*dx + dy*dy);

      // Эффективный размер пятна с учётом расфокусировки по Z
      const baseSpot = state.spot / 1200;
      const dzAbs = Math.abs(dz);
      const effSpot = baseSpot + dzAbs * (0.6 / convFactor);

      // Радиус поражения для разных типов
      let hitRadius;
      switch (f.type) {
        case 'punctate': hitRadius = f.size * 1.5 + effSpot; break;
        case 'fibrillar': hitRadius = f.size * 0.28 + effSpot; break;
        case 'cloud': hitRadius = f.size * 0.55 + effSpot; break;
        case 'weiss': hitRadius = f.size * 0.45 + effSpot; break;
        default: hitRadius = f.size * 0.4 + effSpot;
      }

      if (xyDist < hitRadius) {
        // Аттенюация энергии по Z (гауссиан вокруг фокальной плоскости)
        const dzAtten = Math.exp(-(dz * dz) / (focalSpread * focalSpread));
        const effectiveEnergy = energy * dzAtten;

        if (effectiveEnergy > f.threshold) {
          const damage = (effectiveEnergy - f.threshold) * 22 / convFactor;
          f.hp -= damage;
          hitAny = true;
          state.score += Math.round(damage);

          // Осколки
          for (let k = 0; k < 5; k++) {
            state.debris.push({
              x: state.aim.x + rand(-8, 8),
              y: state.aim.y + rand(-8, 8),
              vx: rand(-40, 40), vy: rand(-50, 30),
              age: 0, life: rand(0.4, 0.8),
              color: f.type === 'cloud' ? [180, 180, 200] : [220, 200, 170],
            });
          }

          if (f.hp <= 0) {
            state.score += 60;
            alert_('good', t('msgDestroyed'));
            playDestroyPop();
            // Финальный взрыв из осколков
            for (let k = 0; k < 10; k++) {
              state.debris.push({
                x: CX + f.x * R + rand(-6, 6),
                y: CY + f.y * R + rand(-6, 6),
                vx: rand(-70, 70), vy: rand(-80, 50),
                age: 0, life: rand(0.6, 1.0),
                color: [240, 220, 180],
              });
            }
          }
        } else if (effectiveEnergy > f.threshold * 0.4) {
          alert_('warn', t('msgNotEnough'));
        }
      }
    }

    if (!hitAny && energy >= 1.2 && lensDmg < 1 && retinaDmg < 1) {
      // Выстрел в пустоту вблизи сетчатки/хрусталика уже наказан
      state.score = Math.max(0, state.score - 2);
    }

    // Пациент дёргается после выстрела
    triggerSaccade(0.35);

    checkGameOver();
    updateHUD();
  }

  function checkGameOver() {
    if (state.lensDamage >= 100) {
      endGame(t('endCataractTitle'), t('endCataractBody'), 'fail');
      return;
    }
    if (state.retinaDamage >= 100) {
      endGame(t('endRetinaTitle'), t('endRetinaBody'), 'fail');
      return;
    }
    const alive = state.floaters.filter(f => f.hp > 0).length;
    if (alive === 0 && state.initialCount > 0) {
      const efficiency = (state.initialCount * 100) / Math.max(state.shots, 1);
      const safetyBonus = Math.round((100 - state.lensDamage - state.retinaDamage) * 8);
      const timeBonus = Math.max(0, 300 - Math.floor(state.elapsed)) * 2;
      state.score += safetyBonus + timeBonus;
      endGame(
        t('endSuccessTitle'),
        t('endSuccessBody', {
          shots: state.shots,
          energy: state.totalEnergy.toFixed(1),
          eff: efficiency.toFixed(0),
          safety: safetyBonus,
          speed: timeBonus
        }),
        'success'
      );
    }
  }

  function endGame(title, body, outcome) {
    state.gameOver = true;
    state.endOutcome = outcome; // 'success' | 'fail'
    modalTitle.textContent = title;
    modalBody.textContent = body + '\n\n' + t('finalScore', { score: state.score });
    modalBody.style.whiteSpace = 'pre-line';
    modal.classList.remove('hidden');
    if (outcome === 'success') playSuccessChime();
    else playFailureTone();
  }

  // ---------- Выбор случая ----------
  function showCasePicker() {
    caseList.innerHTML = '';
    CASES.forEach((c, idx) => {
      const item = document.createElement('div');
      item.className = 'case-item';
      const diffKey = { easy: 'difEasy', medium: 'difMedium', hard: 'difHard' }[c.difficulty];
      const name = document.createElement('div');
      name.className = 'name';
      name.textContent = t(c.nameKey);
      const diff = document.createElement('span');
      diff.className = 'difficulty ' + c.difficulty;
      diff.textContent = t(diffKey);
      name.appendChild(diff);
      const desc = document.createElement('div');
      desc.className = 'desc';
      desc.textContent = t(c.descKey);
      item.appendChild(name);
      item.appendChild(desc);
      item.addEventListener('click', () => {
        caseModal.classList.add('hidden');
        startCase(idx);
      });
      caseList.appendChild(item);
    });
    caseModal.classList.remove('hidden');
  }

  function startCase(idx) {
    const c = CASES[idx];
    state.currentCaseIdx = idx;
    state.floaters = c.gen();
    state.floaters.forEach(createFloaterSprite);
    state.initialCount = state.floaters.length;
    state.lensDamage = 0;
    state.retinaDamage = 0;
    state.shots = 0;
    state.score = 0;
    state.totalEnergy = 0;
    state.startTime = performance.now();
    state.elapsed = 0;
    state.gameOver = false;
    state.paused = false;
    state.pulses = [];
    state.debris = [];
    state.burns = [];
    state.cooldown = 0;
    state.saccade.vx = 0; state.saccade.vy = 0; state.saccade.t = 0;
    pauseBtn.textContent = t('btnPause');
    modal.classList.add('hidden');
    caseModal.classList.add('hidden');
    caseName.textContent = t(c.nameKey);
    caseDesc.textContent = t(c.descKey);
    alertsEl.innerHTML = '';
    alert_('info', t('msgCase', { name: t(c.nameKey) }));
    updateHUD();
  }

  // ---------- Цикл ----------
  let lastT = performance.now();
  function loop(now) {
    const dt = Math.min(0.05, (now - lastT) / 1000);
    lastT = now;
    if (!state.paused && !state.gameOver) update(dt);
    render();
    requestAnimationFrame(loop);
  }

  function update(dt) {
    state.elapsed = (performance.now() - state.startTime) / 1000;
    const prevCD = state.cooldown;
    state.cooldown = Math.max(0, state.cooldown - dt);
    if (prevCD > 0 && state.cooldown === 0) playReadyBlip();
    state.flash = Math.max(0, state.flash - dt * 2);

    // Саккада
    if (state.saccade.t > 0) {
      state.saccade.t -= dt;
    } else {
      state.saccade.vx *= state.saccade.decay;
      state.saccade.vy *= state.saccade.decay;
      if (Math.abs(state.saccade.vx) < 0.001) state.saccade.vx = 0;
      if (Math.abs(state.saccade.vy) < 0.001) state.saccade.vy = 0;
    }

    // Помутнения
    for (const f of state.floaters) {
      if (f.hp <= 0) continue;
      // Базовый дрейф (гравитация в стекловидном теле + лёгкая турбулентность)
      f.x += f.drift.x * dt + state.saccade.vx * dt;
      f.y += f.drift.y * dt + state.saccade.vy * dt;
      // Микроскопическая броуновская составляющая
      f.x += rand(-0.025, 0.025) * dt;
      f.y += rand(-0.025, 0.025) * dt;
      // Лёгкое колебание глубины (студенистая инерция)
      f.z += rand(-0.008, 0.008) * dt;
      f.z = clamp(f.z, 0.18, 0.92);

      // Ограничение в пределах поля
      const r = Math.hypot(f.x, f.y);
      if (r > 0.86) {
        const nx = f.x / r, ny = f.y / r;
        f.x -= nx * (r - 0.86) * 0.6;
        f.y -= ny * (r - 0.86) * 0.6;
        f.drift.x *= -0.6;
        f.drift.y *= -0.6;
      }
      if (f.rotation !== undefined) f.rotation += 0.06 * dt;
      if (f.wave !== undefined) f.wave += 0.8 * dt;
    }

    // Случайные саккады пациента
    if (Math.random() < 0.0025) triggerSaccade(0.5);

    // Импульсы
    for (const p of state.pulses) p.age += dt;
    state.pulses = state.pulses.filter(p => p.age < p.life);

    // Осколки
    for (const d of state.debris) {
      d.age += dt;
      d.x += d.vx * dt;
      d.y += d.vy * dt;
      d.vy += 70 * dt;
      d.vx *= 0.97;
    }
    state.debris = state.debris.filter(d => d.age < d.life);

    // Ожоги — постепенно остывают
    for (const b of state.burns) b.a -= b.decay * dt * 0.3;
    state.burns = state.burns.filter(b => b.a > 0.05);

    updateHUD();
  }

  // ---------- Кеш офскрин-канвасов ----------
  let _fundusBaked = null;
  let _depthBaked = null;
  let _vessels = null;

  function buildVessels(ox, oy) {
    const segs = [];
    const rng = mulberry32(73);
    function branch(x, y, ang, len, width, depth) {
      if (depth > 7 || width < 0.35) return;
      const ex = x + Math.cos(ang) * len;
      const ey = y + Math.sin(ang) * len;
      segs.push({ x1: x, y1: y, x2: ex, y2: ey, width });
      if (rng() < 0.88) {
        branch(ex, ey, ang + (rng() - 0.5) * 0.85, len * (0.55 + rng() * 0.3), width * 0.78, depth + 1);
      }
      if (rng() < 0.6) {
        branch(ex, ey, ang - (rng() - 0.5) * 0.85, len * (0.5 + rng() * 0.3), width * 0.72, depth + 1);
      }
    }
    branch(ox, oy, Math.PI * 0.9, R * 0.18, 3.8, 0);
    branch(ox, oy, Math.PI * 1.1, R * 0.18, 3.8, 0);
    branch(ox, oy, Math.PI * 0.68, R * 0.16, 3.0, 0);
    branch(ox, oy, Math.PI * 1.32, R * 0.16, 3.0, 0);
    branch(ox, oy, Math.PI * 0.5, R * 0.12, 2.4, 1);
    branch(ox, oy, Math.PI * 1.5, R * 0.12, 2.4, 1);
    return segs;
  }

  // ---------- Рендер фундуса ----------
  function render() {
    fctx.fillStyle = '#000';
    fctx.fillRect(0, 0, W, H);

    drawFundus();

    fctx.save();
    fctx.beginPath();
    fctx.arc(CX, CY, R, 0, Math.PI * 2);
    fctx.clip();

    drawBurns();
    drawFloaters();
    drawDebris();

    fctx.restore();

    // Граница глаза
    fctx.strokeStyle = '#3a2418';
    fctx.lineWidth = 5;
    fctx.beginPath();
    fctx.arc(CX, CY, R, 0, Math.PI * 2);
    fctx.stroke();

    drawPulses();
    drawCrosshair();

    if (state.flash > 0) {
      fctx.fillStyle = `rgba(255,250,230,${state.flash * 0.18})`;
      fctx.fillRect(0, 0, W, H);
    }

    if (state.paused) {
      fctx.fillStyle = 'rgba(0,0,0,0.55)';
      fctx.fillRect(0, 0, W, H);
      fctx.fillStyle = '#ff8a4d';
      fctx.font = 'bold 32px -apple-system, system-ui';
      fctx.textAlign = 'center';
      fctx.fillText(t('pauseLabel'), CX, CY);
    }

    renderDepth();
  }

  // Запекаем всё статичное содержимое глазного дна один раз
  function bakeFundus() {
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const ctx = c.getContext('2d');

    ctx.save();
    ctx.beginPath();
    ctx.arc(CX, CY, R, 0, Math.PI * 2);
    ctx.clip();

    const grad = ctx.createRadialGradient(CX, CY, R * 0.1, CX, CY, R);
    grad.addColorStop(0, '#9a3a22');
    grad.addColorStop(0.4, '#822818');
    grad.addColorStop(0.85, '#4a1408');
    grad.addColorStop(1, '#1a0604');
    ctx.fillStyle = grad;
    ctx.fillRect(CX - R, CY - R, R * 2, R * 2);

    // Текстура пигментного эпителия
    const rng = mulberry32(11);
    for (let i = 0; i < 900; i++) {
      const x = rng() * W, y = rng() * H;
      const a = 0.04 + rng() * 0.10;
      ctx.fillStyle = `rgba(${30 + rng()*40},${10 + rng()*20},${5},${a})`;
      ctx.beginPath();
      ctx.arc(x, y, 0.6 + rng() * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Диск зрительного нерва — мягкий радиальный градиент (без filter blur)
    const odX = CX + R * 0.42;
    const odY = CY + R * 0.06;
    const odGrad = ctx.createRadialGradient(odX, odY, 2, odX, odY, R * 0.11);
    odGrad.addColorStop(0, '#fff5d0');
    odGrad.addColorStop(0.4, '#f0d090');
    odGrad.addColorStop(0.8, 'rgba(180,120,60,0.45)');
    odGrad.addColorStop(1, 'rgba(180,120,60,0)');
    ctx.fillStyle = odGrad;
    ctx.beginPath();
    ctx.ellipse(odX, odY, R * 0.10, R * 0.105, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255,250,230,0.85)';
    ctx.beginPath();
    ctx.ellipse(odX, odY, R * 0.04, R * 0.045, 0, 0, Math.PI * 2);
    ctx.fill();

    // Макула как радиальный градиент — естественное мягкое затемнение
    const mcX = CX - R * 0.04, mcY = CY;
    const mcGrad = ctx.createRadialGradient(mcX, mcY, 0, mcX, mcY, R * 0.12);
    mcGrad.addColorStop(0, 'rgba(20,5,2,0.85)');
    mcGrad.addColorStop(0.3, 'rgba(45,12,6,0.6)');
    mcGrad.addColorStop(0.7, 'rgba(55,18,8,0.3)');
    mcGrad.addColorStop(1, 'rgba(60,20,10,0)');
    ctx.fillStyle = mcGrad;
    ctx.beginPath();
    ctx.arc(mcX, mcY, R * 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(15,3,1,0.9)';
    ctx.beginPath();
    ctx.arc(mcX, mcY, R * 0.018, 0, Math.PI * 2);
    ctx.fill();

    // Сосуды
    if (!_vessels) _vessels = buildVessels(odX, odY);
    for (const s of _vessels) {
      const isArtery = s.width > 2.2;
      ctx.strokeStyle = isArtery ? 'rgba(150,25,18,0.92)' : 'rgba(95,15,12,0.85)';
      ctx.lineWidth = s.width;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(s.x1, s.y1);
      ctx.lineTo(s.x2, s.y2);
      ctx.stroke();
    }

    ctx.restore();
    _fundusBaked = c;
  }

  function drawFundus() {
    if (!_fundusBaked) bakeFundus();
    // Симуляция расфокусировки сетчатки через альфу — на порядок дешевле filter blur
    const retinaSharpness = clamp(1 - Math.abs(state.focusZ - 0.92) * 1.4, 0.45, 1);
    fctx.globalAlpha = 0.55 + retinaSharpness * 0.45;
    fctx.drawImage(_fundusBaked, 0, 0);
    fctx.globalAlpha = 1;
  }

  function drawBurns() {
    for (const b of state.burns) {
      const g = fctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
      g.addColorStop(0, `rgba(255,250,220,${b.a * 0.9})`);
      g.addColorStop(0.4, `rgba(255,180,90,${b.a * 0.5})`);
      g.addColorStop(1, `rgba(120,30,10,0)`);
      fctx.fillStyle = g;
      fctx.beginPath();
      fctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      fctx.fill();
      // Тёмный центр (некроз)
      fctx.fillStyle = `rgba(30,10,5,${b.a * 0.7})`;
      fctx.beginPath();
      fctx.arc(b.x, b.y, b.r * 0.3, 0, Math.PI * 2);
      fctx.fill();
    }
  }

  // ---------- Запекание спрайтов помутнений ----------
  // Один раз на случай рисуем детальный реалистичный спрайт во вспомогательный canvas.
  // В drawFloaters остаётся быстрый drawImage без сложных путей.
  function createFloaterSprite(f) {
    const baseR = f.size * R;
    const pad = Math.max(22, baseR * 0.45);
    const dim = Math.ceil(baseR * 2 + pad * 2);
    f.spriteDim = dim;
    f.spriteR = baseR;

    const c = document.createElement('canvas');
    c.width = c.height = dim;
    const ctx = c.getContext('2d');
    const cx = dim / 2, cy = dim / 2;
    const rng = mulberry32(f.id * 1373 + 17);

    switch (f.type) {
      case 'weiss': bakeWeiss(ctx, cx, cy, baseR, rng, f); break;
      case 'fibrillar': bakeFibrillar(ctx, cx, cy, baseR, rng, f); break;
      case 'cloud': bakeCloud(ctx, cx, cy, baseR, rng, f); break;
      case 'punctate': bakePunctate(ctx, cx, cy, baseR, rng, f); break;
    }
    f.sprite = c;
  }

  function bakeWeiss(ctx, cx, cy, r, rng, f) {
    // Кольцо Вейса: разорванное (C-образное), полупрозрачное, со «шлейфом» волокон
    const breakStart = rng() * Math.PI * 2;
    const breakSize = 0.18 + rng() * 0.4;
    const tilt = f.tilt || (0.68 + rng() * 0.25);
    const ringW = r * (0.13 + rng() * 0.05);
    const arcA = breakStart + breakSize;
    const arcB = breakStart + Math.PI * 2 - 0.0001;

    ctx.save();
    // Гало вокруг кольца
    ctx.shadowColor = 'rgba(15,10,5,0.55)';
    ctx.shadowBlur = 9;

    // Основное полупрозрачное тело кольца
    ctx.strokeStyle = 'rgba(45,38,28,0.78)';
    ctx.lineWidth = ringW;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.ellipse(cx, cy, r * 0.88, r * 0.88 * tilt, 0, arcA, arcB);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Внешний блик
    ctx.strokeStyle = 'rgba(115,98,78,0.18)';
    ctx.lineWidth = ringW * 0.4;
    ctx.beginPath();
    ctx.ellipse(cx, cy, r * 0.93, r * 0.93 * tilt, 0, arcA, arcB);
    ctx.stroke();

    // Внутренняя тёмная линия
    ctx.strokeStyle = 'rgba(15,10,3,0.42)';
    ctx.lineWidth = ringW * 0.28;
    ctx.beginPath();
    ctx.ellipse(cx, cy, r * 0.82, r * 0.82 * tilt, 0, arcA, arcB);
    ctx.stroke();

    // Лёгкая неравномерность — пара утолщений
    for (let i = 0; i < 2; i++) {
      const t = rng();
      const a = arcA + (arcB - arcA) * t;
      const bx = cx + Math.cos(a) * r * 0.88;
      const by = cy + Math.sin(a) * r * 0.88 * tilt;
      ctx.fillStyle = 'rgba(35,25,15,0.5)';
      ctx.beginPath();
      ctx.arc(bx, by, ringW * 0.55, 0, Math.PI * 2);
      ctx.fill();
    }

    // Шлейф остаточных волокон от одного из концов
    const endA = arcA;
    const tailX = cx + Math.cos(endA) * r * 0.88;
    const tailY = cy + Math.sin(endA) * r * 0.88 * tilt;
    const tangX = -Math.sin(endA);
    const tangY = Math.cos(endA) * tilt;
    ctx.strokeStyle = 'rgba(42,32,22,0.55)';
    ctx.lineCap = 'round';
    const fibrils = 3 + Math.floor(rng() * 2);
    for (let k = 0; k < fibrils; k++) {
      const lineW = 0.7 + rng() * 1.3;
      const len = r * (0.25 + rng() * 0.45);
      const spread = (rng() - 0.5) * 0.7;
      const dirX = tangX * Math.cos(spread) - tangY * Math.sin(spread);
      const dirY = tangX * Math.sin(spread) + tangY * Math.cos(spread);
      ctx.lineWidth = lineW;
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.bezierCurveTo(
        tailX + dirX * len * 0.35 + (rng() - 0.5) * 5,
        tailY + dirY * len * 0.35 + (rng() - 0.5) * 5,
        tailX + dirX * len * 0.75 + (rng() - 0.5) * 6,
        tailY + dirY * len * 0.75 + (rng() - 0.5) * 6,
        tailX + dirX * len, tailY + dirY * len
      );
      ctx.stroke();
    }
    ctx.restore();
  }

  function bakeFibrillar(ctx, cx, cy, r, rng, f) {
    // Сетка коллагеновых волокон с ветвлениями и узелками
    ctx.save();
    ctx.shadowColor = 'rgba(15,10,5,0.4)';
    ctx.shadowBlur = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const mainA = rng() * Math.PI * 2;
    const dirX = Math.cos(mainA);
    const dirY = Math.sin(mainA);
    const perpX = -dirY, perpY = dirX;

    // Контрольные точки основной нити
    const segs = 7;
    const samples = [];
    for (let i = 0; i <= segs; i++) {
      const t = (i / segs - 0.5) * 2;
      const x = cx + dirX * r * t + perpX * (rng() - 0.5) * r * 0.25;
      const y = cy + dirY * r * t + perpY * (rng() - 0.5) * r * 0.25;
      samples.push({ x, y });
    }

    // Основной ствол — плавная кривая с переменной толщиной
    ctx.strokeStyle = 'rgba(40,30,20,0.85)';
    for (let i = 0; i < samples.length - 1; i++) {
      const a = samples[i], b = samples[i + 1];
      ctx.lineWidth = 1.6 + rng() * 1.6;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      const midx = (a.x + b.x) / 2 + (rng() - 0.5) * 4;
      const midy = (a.y + b.y) / 2 + (rng() - 0.5) * 4;
      ctx.quadraticCurveTo(midx, midy, b.x, b.y);
      ctx.stroke();
    }

    // Ветви от средних узлов
    for (let i = 1; i < samples.length - 1; i++) {
      if (rng() < 0.7) {
        ctx.lineWidth = 0.9 + rng() * 1.0;
        ctx.strokeStyle = `rgba(38,28,18,${0.55 + rng() * 0.25})`;
        const side = rng() < 0.5 ? 1 : -1;
        const ang = mainA + side * (Math.PI / 2 + (rng() - 0.5) * 0.7);
        const blen = r * (0.18 + rng() * 0.35);
        const bx = samples[i].x + Math.cos(ang) * blen;
        const by = samples[i].y + Math.sin(ang) * blen;
        ctx.beginPath();
        ctx.moveTo(samples[i].x, samples[i].y);
        ctx.quadraticCurveTo(
          samples[i].x + Math.cos(ang) * blen * 0.5 + (rng() - 0.5) * 4,
          samples[i].y + Math.sin(ang) * blen * 0.5 + (rng() - 0.5) * 4,
          bx, by
        );
        ctx.stroke();

        // Под-ветвь
        if (rng() < 0.4) {
          ctx.lineWidth = 0.6 + rng() * 0.5;
          ctx.strokeStyle = 'rgba(35,25,15,0.45)';
          const sbA = ang + (rng() - 0.5) * 0.9;
          const sblen = blen * (0.35 + rng() * 0.3);
          ctx.beginPath();
          ctx.moveTo(bx, by);
          ctx.lineTo(bx + Math.cos(sbA) * sblen, by + Math.sin(sbA) * sblen);
          ctx.stroke();
        }
      }
    }
    ctx.shadowBlur = 0;

    // Узелки на стыках
    ctx.fillStyle = 'rgba(25,18,10,0.72)';
    for (let i = 1; i < samples.length - 1; i++) {
      if (rng() < 0.45) {
        ctx.beginPath();
        ctx.arc(samples[i].x, samples[i].y, 1.0 + rng() * 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  function bakeCloud(ctx, cx, cy, r, rng, f) {
    // Облако: несколько мягких размытых blob-ов + гранулярные включения + завитки
    ctx.save();
    const blobs = 5 + Math.floor(rng() * 4);
    for (let i = 0; i < blobs; i++) {
      const bx = cx + (rng() - 0.5) * r * 1.15;
      const by = cy + (rng() - 0.5) * r * 0.85;
      const br = r * (0.25 + rng() * 0.40);
      const d = 0.22 + rng() * 0.28;
      const g = ctx.createRadialGradient(bx, by, 0, bx, by, br);
      g.addColorStop(0, `rgba(20,14,8,${d})`);
      g.addColorStop(0.5, `rgba(22,16,10,${d * 0.55})`);
      g.addColorStop(1, 'rgba(22,16,10,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.fill();
    }

    // Гранулярные включения (коллагеновые конденсации)
    const flecks = 18 + Math.floor(rng() * 12);
    for (let i = 0; i < flecks; i++) {
      const a = rng() * Math.PI * 2;
      const rr = rng() * r * 0.75;
      const fx = cx + Math.cos(a) * rr;
      const fy = cy + Math.sin(a) * rr * 0.85;
      const sz = 0.4 + rng() * 0.9;
      ctx.fillStyle = rng() < 0.7
        ? `rgba(15,10,5,${0.4 + rng() * 0.3})`
        : `rgba(180,160,135,${0.25 + rng() * 0.25})`;
      ctx.beginPath();
      ctx.arc(fx, fy, sz, 0, Math.PI * 2);
      ctx.fill();
    }

    // Завитки/нити по краю
    ctx.strokeStyle = 'rgba(28,20,12,0.32)';
    ctx.lineWidth = 0.9;
    ctx.lineCap = 'round';
    const tendrils = 2 + Math.floor(rng() * 3);
    for (let i = 0; i < tendrils; i++) {
      const a = rng() * Math.PI * 2;
      const sx = cx + Math.cos(a) * r * 0.5;
      const sy = cy + Math.sin(a) * r * 0.5 * 0.9;
      const ex = cx + Math.cos(a) * r * 1.05;
      const ey = cy + Math.sin(a) * r * 1.05 * 0.9;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.quadraticCurveTo(
        (sx + ex) / 2 + (rng() - 0.5) * 8,
        (sy + ey) / 2 + (rng() - 0.5) * 8,
        ex, ey
      );
      ctx.stroke();
    }
    ctx.restore();
  }

  function bakePunctate(ctx, cx, cy, r, rng, f) {
    // Маленькое полупрозрачное тельце с блёстким бликом
    ctx.save();
    ctx.shadowColor = 'rgba(8,4,2,0.55)';
    ctx.shadowBlur = 2.5;
    const g = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, 0, cx, cy, r);
    g.addColorStop(0, 'rgba(95,75,55,0.92)');
    g.addColorStop(0.55, 'rgba(28,20,12,0.95)');
    g.addColorStop(1, 'rgba(15,10,5,0.65)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawFloaters() {
    // Имитируем расфокусировку через радиальные градиенты и масштаб,
    // полностью избегая filter:blur (на канвасе это самый медленный путь).
    for (const f of state.floaters) {
      if (f.hp <= 0) continue;
      const sx = CX + f.x * R;
      const sy = CY + f.y * R;
      const dz = Math.abs(f.z - state.focusZ);
      const blurF = clamp(dz * 2.4, 0, 1); // 0 — резко, 1 — сильно размыто
      const hpFrac = f.hp / f.maxHp;
      const fadeAlpha = f.opacity * clamp(1 - dz * 0.55, 0.15, 1) * (0.4 + hpFrac * 0.6) * (1 - blurF * 0.35);
      const sizePx = f.size * R * (1 + blurF * 0.55) * (0.6 + hpFrac * 0.4);

      fctx.save();
      fctx.globalAlpha = fadeAlpha;
      fctx.translate(sx, sy);
      if (f.rotation) fctx.rotate(f.rotation);

      // В резком фокусе — используем запечённый детальный спрайт (один drawImage),
      // вне фокуса — мягкие градиенты (без filter:blur)
      if (blurF < 0.32 && f.sprite) {
        const sharpness = 1 - blurF / 0.32; // 1 в полном фокусе, 0 на пороге
        const scale = (sizePx / f.spriteR) * (1 + (1 - sharpness) * 0.15);
        fctx.scale(scale, scale);
        // При приближении к порогу — плавное гашение, чтобы перейти к градиентному варианту
        fctx.globalAlpha = fadeAlpha * (0.4 + sharpness * 0.6);
        fctx.drawImage(f.sprite, -f.spriteDim / 2, -f.spriteDim / 2);
        fctx.restore();
        // Дополнительный «бекинг» градиент при средней расфокусировке (плавный переход)
        if (blurF > 0.15) {
          fctx.save();
          fctx.globalAlpha = fadeAlpha * (blurF - 0.15) / 0.17 * 0.5;
          fctx.translate(sx, sy);
          drawBlurredFallback(f, sizePx, blurF);
          fctx.restore();
        }
        continue;
      }

      // Полностью расфокусированное состояние — мягкое пятно
      drawBlurredFallback(f, sizePx, blurF);
      fctx.restore();
    }
  }

  function drawBlurredFallback(f, sizePx, blurF) {
    switch (f.type) {
      case 'weiss': {
        const outer = sizePx * (1.15 + blurF * 0.25);
        const g = fctx.createRadialGradient(0, 0, sizePx * 0.55, 0, 0, outer);
        g.addColorStop(0, 'rgba(20,15,10,0)');
        g.addColorStop(0.45, `rgba(20,15,10,${0.55 - blurF * 0.2})`);
        g.addColorStop(0.75, `rgba(25,18,12,${0.45 - blurF * 0.18})`);
        g.addColorStop(1, 'rgba(25,18,12,0)');
        fctx.fillStyle = g;
        fctx.beginPath();
        fctx.ellipse(0, 0, outer, outer * (f.tilt || 0.8), 0, 0, Math.PI * 2);
        fctx.fill();
        break;
      }
      case 'fibrillar': {
        const lineW = (2.6 + blurF * 5);
        fctx.strokeStyle = `rgba(18,12,8,${0.9 - blurF * 0.35})`;
        fctx.lineWidth = lineW;
        fctx.lineCap = 'round';
        fctx.beginPath();
        fctx.moveTo(-sizePx, 0);
        fctx.bezierCurveTo(-sizePx * 0.5, sizePx * 0.4, sizePx * 0.3, -sizePx * 0.35, sizePx, 0);
        fctx.stroke();
        break;
      }
      case 'cloud': {
        const rad = sizePx * (1 + blurF * 0.5);
        const g = fctx.createRadialGradient(0, 0, 0, 0, 0, rad);
        g.addColorStop(0, `rgba(15,10,5,${0.75 - blurF * 0.25})`);
        g.addColorStop(0.4, `rgba(20,15,10,${0.45 - blurF * 0.12})`);
        g.addColorStop(0.8, 'rgba(20,15,10,0.10)');
        g.addColorStop(1, 'rgba(20,15,10,0)');
        fctx.fillStyle = g;
        fctx.beginPath();
        fctx.ellipse(0, 0, rad, rad * 0.7, 0, 0, Math.PI * 2);
        fctx.fill();
        break;
      }
      case 'punctate': {
        const rad = sizePx * (1 + blurF * 1.8);
        const g = fctx.createRadialGradient(0, 0, 0, 0, 0, rad);
        g.addColorStop(0, `rgba(10,5,2,${0.9 - blurF * 0.35})`);
        g.addColorStop(0.55, `rgba(10,5,2,${0.3 - blurF * 0.12})`);
        g.addColorStop(1, 'rgba(10,5,2,0)');
        fctx.fillStyle = g;
        fctx.beginPath();
        fctx.arc(0, 0, rad, 0, Math.PI * 2);
        fctx.fill();
        break;
      }
    }
  }

  function drawDebris() {
    for (const d of state.debris) {
      const a = 1 - d.age / d.life;
      const [r, g, b] = d.color || [220, 200, 170];
      fctx.fillStyle = `rgba(${r},${g},${b},${a * 0.8})`;
      fctx.beginPath();
      fctx.arc(d.x, d.y, 1.5 + a * 1.2, 0, Math.PI * 2);
      fctx.fill();
    }
  }

  function drawPulses() {
    for (const p of state.pulses) {
      const t = p.age / p.life;
      const a = 1 - t;
      const radius = 8 + p.age * 130;
      const grad = fctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
      grad.addColorStop(0, `rgba(180,255,210,${a * 0.95})`);
      grad.addColorStop(0.25, `rgba(120,220,255,${a * 0.55})`);
      grad.addColorStop(0.6, `rgba(80,180,255,${a * 0.25})`);
      grad.addColorStop(1, 'rgba(80,180,255,0)');
      fctx.fillStyle = grad;
      fctx.beginPath();
      fctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      fctx.fill();

      // Центральная плазменная точка
      const cR = 4 * (1 - t);
      if (cR > 0.5) {
        fctx.fillStyle = `rgba(255,255,255,${a})`;
        fctx.beginPath();
        fctx.arc(p.x, p.y, cR, 0, Math.PI * 2);
        fctx.fill();
      }
    }
  }

  function drawCrosshair() {
    const x = state.aim.x, y = state.aim.y;

    // Ищем ближайшее помутнение под прицелом — определяем целевую Z
    let targetZ = null;
    let bestD2 = 70 * 70;
    for (const f of state.floaters) {
      if (f.hp <= 0) continue;
      const fxp = CX + f.x * R;
      const fyp = CY + f.y * R;
      const dx = x - fxp, dy = y - fyp;
      const d2 = dx * dx + dy * dy;
      if (d2 < bestD2) {
        bestD2 = d2;
        targetZ = f.z;
      }
    }

    // Расстояние между лучками наведения — сходятся, когда Z совпадает с целью
    let spacing;
    if (targetZ !== null) {
      const dz = Math.abs(state.focusZ - targetZ);
      spacing = clamp(dz * 95, 0, 26);
    } else {
      // Цели нет — лучки в средней разводке
      spacing = 14;
    }

    // Саккада — дрожание лучков
    const sx = Math.hypot(state.saccade.vx, state.saccade.vy);
    const jx = sx > 0.05 ? rand(-2, 2) * sx * 3 : 0;
    const jy = sx > 0.05 ? rand(-2, 2) * sx * 3 : 0;
    const ax = x + jx, ay = y + jy;

    // Цвет лучков (He-Ne красный; жёлтый — небезопасные параметры)
    let dotColor = '#ff3a22';
    let warn = false;
    if (state.focusZ < 0.10 || state.focusZ > 0.90) { dotColor = '#ffd000'; warn = true; }
    else if (state.energy > 9) { dotColor = '#ffd000'; warn = true; }
    else if (state.focusZ < 0.18 || state.focusZ > 0.82 || state.energy > 8) { dotColor = '#ff7a30'; }

    // Кулдаун — приглушение лучков на время восстановления
    const alpha = state.cooldown > 0 ? 0.3 : 1.0;
    const merged = spacing < 1.6;

    fctx.save();
    fctx.globalAlpha = alpha;
    fctx.shadowColor = dotColor;
    fctx.shadowBlur = 6;
    fctx.fillStyle = dotColor;

    if (merged) {
      // Лучки сошлись — лазер сфокусирован на цели
      fctx.beginPath();
      fctx.arc(ax, ay, 2.8, 0, Math.PI * 2);
      fctx.fill();
      fctx.shadowBlur = 0;
      fctx.fillStyle = '#fff';
      fctx.beginPath();
      fctx.arc(ax, ay, 1.1, 0, Math.PI * 2);
      fctx.fill();
    } else {
      fctx.beginPath();
      fctx.arc(ax - spacing / 2, ay, 1.9, 0, Math.PI * 2);
      fctx.fill();
      fctx.beginPath();
      fctx.arc(ax + spacing / 2, ay, 1.9, 0, Math.PI * 2);
      fctx.fill();
    }
    fctx.restore();

    // Тонкое предупреждение при опасных параметрах — небольшой жёлтый кружок
    if (warn) {
      fctx.strokeStyle = 'rgba(255,208,0,0.5)';
      fctx.lineWidth = 1;
      fctx.setLineDash([3, 3]);
      fctx.beginPath();
      fctx.arc(ax, ay, 18, 0, Math.PI * 2);
      fctx.stroke();
      fctx.setLineDash([]);
    }
  }

  // ---------- Боковая проекция ----------
  const DEPTH_LAYOUT = (() => {
    const w = depth.width, h = depth.height;
    const cx = w / 2, cy = h / 2;
    const eyeR = 105;
    const vitTop = cy - eyeR * 0.35;
    const vitBot = cy + eyeR - 4;
    return { w, h, cx, cy, eyeR, vitTop, vitBot, vitH: vitBot - vitTop };
  })();

  function bakeDepth() {
    const { w, h, cx, cy, eyeR, vitTop, vitBot, vitH } = DEPTH_LAYOUT;
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const ctx = c.getContext('2d');

    ctx.fillStyle = '#060910';
    ctx.fillRect(0, 0, w, h);

    // Контур глаза
    ctx.strokeStyle = '#2a3441';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, eyeR, 0, Math.PI * 2);
    ctx.stroke();

    // Зоны опасности и предупреждения
    const lensDangerH = 0.10 * vitH;
    const lensWarnH = 0.18 * vitH;
    const retinaDangerH = 0.10 * vitH;
    const retinaWarnH = 0.18 * vitH;

    ctx.fillStyle = 'rgba(239,68,68,0.20)';
    ctx.fillRect(cx - eyeR + 8, vitTop, (eyeR - 8) * 2, lensDangerH);
    ctx.fillRect(cx - eyeR + 8, vitBot - retinaDangerH, (eyeR - 8) * 2, retinaDangerH);

    ctx.fillStyle = 'rgba(251,191,36,0.10)';
    ctx.fillRect(cx - eyeR + 8, vitTop + lensDangerH, (eyeR - 8) * 2, lensWarnH - lensDangerH);
    ctx.fillRect(cx - eyeR + 8, vitBot - retinaWarnH, (eyeR - 8) * 2, retinaWarnH - retinaDangerH);

    ctx.fillStyle = 'rgba(74,222,128,0.05)';
    ctx.fillRect(cx - eyeR + 8, vitTop + lensWarnH, (eyeR - 8) * 2, vitH - lensWarnH - retinaWarnH);

    // Сетчатка
    ctx.strokeStyle = '#aa3a2a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, eyeR - 4, Math.PI * 0.2, Math.PI * 0.8);
    ctx.stroke();

    // Хрусталик
    ctx.fillStyle = 'rgba(160,200,235,0.30)';
    ctx.strokeStyle = '#7aaacc';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.ellipse(cx, cy - eyeR * 0.45, 22, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Радужка
    ctx.strokeStyle = '#8a6a4a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - 40, cy - eyeR * 0.55);
    ctx.lineTo(cx - 14, cy - eyeR * 0.5);
    ctx.moveTo(cx + 14, cy - eyeR * 0.5);
    ctx.lineTo(cx + 40, cy - eyeR * 0.55);
    ctx.stroke();

    // Роговица
    ctx.strokeStyle = '#5a8aaa';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy - eyeR * 0.45, 42, Math.PI * 1.05, Math.PI * 1.95);
    ctx.stroke();

    // Зрительный нерв
    ctx.fillStyle = '#9aa0a8';
    ctx.fillRect(cx - 8, cy + eyeR - 4, 16, 14);
    ctx.strokeStyle = '#5a6878';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(cx - 8, cy + eyeR - 4, 16, 14);

    // Подписи
    ctx.fillStyle = '#5a6878';
    ctx.font = '9px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(t('lensLabel'), 8, vitTop - 4);
    ctx.fillText(t('retinaLabel'), 8, vitBot + 12);

    _depthBaked = c;
  }

  function renderDepth() {
    if (!_depthBaked) bakeDepth();
    const { w, cx, eyeR, vitTop, vitBot, vitH } = DEPTH_LAYOUT;

    dctx.drawImage(_depthBaked, 0, 0);

    // Конус лазера
    const fz = state.focusZ;
    const focusY = vitTop + fz * vitH;
    const coneW = (24 - state.convergence) * 1.2 + 6;
    const coneGrad = dctx.createLinearGradient(cx, vitTop - 30, cx, focusY);
    coneGrad.addColorStop(0, 'rgba(77,196,255,0.05)');
    coneGrad.addColorStop(1, 'rgba(77,196,255,0.32)');
    dctx.fillStyle = coneGrad;
    dctx.beginPath();
    dctx.moveTo(cx - coneW, vitTop - 30);
    dctx.lineTo(cx + coneW, vitTop - 30);
    dctx.lineTo(cx + 2, focusY);
    dctx.lineTo(cx - 2, focusY);
    dctx.closePath();
    dctx.fill();

    // Помутнения
    for (const f of state.floaters) {
      if (f.hp <= 0) continue;
      const fyP = vitTop + f.z * vitH;
      const fxP = cx + f.x * (eyeR - 14) * 0.5;
      const hpFrac = f.hp / f.maxHp;
      dctx.fillStyle = `rgba(220,220,225,${0.4 + hpFrac * 0.5})`;
      dctx.beginPath();
      const r = f.type === 'punctate' ? 1.4 : f.type === 'cloud' ? 4 : 2.5;
      dctx.arc(fxP, fyP, r * (0.5 + hpFrac * 0.5), 0, Math.PI * 2);
      dctx.fill();
    }

    // Линия фокуса
    dctx.strokeStyle = '#4dc4ff';
    dctx.lineWidth = 1.8;
    dctx.setLineDash([5, 3]);
    dctx.beginPath();
    dctx.moveTo(cx - eyeR + 2, focusY);
    dctx.lineTo(cx + eyeR - 2, focusY);
    dctx.stroke();
    dctx.setLineDash([]);

    // Точка фокуса
    dctx.fillStyle = '#4dc4ff';
    dctx.beginPath();
    dctx.arc(cx, focusY, 4, 0, Math.PI * 2);
    dctx.fill();

    // Подпись Z
    dctx.fillStyle = '#4dc4ff';
    dctx.font = '9px monospace';
    dctx.textAlign = 'right';
    dctx.fillText(`Z = ${state.focusZ.toFixed(2)}`, w - 6, focusY - 5);
  }

  // ---------- HUD ----------
  function updateHUD() {
    const secs = Math.floor(state.elapsed);
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    timeEl.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    shotsEl.textContent = state.shots;
    scoreEl.textContent = state.score;
    totalEnergyEl.textContent = state.totalEnergy.toFixed(1) + ' мДж';

    const alive = state.floaters.filter(f => f.hp > 0).length;
    const destroyed = state.initialCount - alive;
    floatersCount.textContent = `${destroyed} / ${state.initialCount}`;

    const fProgress = state.initialCount > 0 ? (destroyed / state.initialCount) * 100 : 0;
    floatersBar.style.width = fProgress + '%';
    floatersBar.className = 'fill ' + (fProgress >= 100 ? 'safe' : fProgress > 50 ? 'warn' : 'danger');

    if (state.shots > 0 && destroyed > 0) {
      const eff = (destroyed / state.shots * 100).toFixed(0);
      efficiencyEl.textContent = `${eff}%`;
    } else {
      efficiencyEl.textContent = '—';
    }

    lensBar.style.width = state.lensDamage + '%';
    retinaBar.style.width = state.retinaDamage + '%';
    lensPct.textContent = Math.round(state.lensDamage) + '%';
    retinaPct.textContent = Math.round(state.retinaDamage) + '%';

    lensBar.className = 'fill ' + (state.lensDamage > 60 ? 'danger' : state.lensDamage > 25 ? 'warn' : 'safe');
    retinaBar.className = 'fill ' + (state.retinaDamage > 60 ? 'danger' : state.retinaDamage > 25 ? 'warn' : 'safe');
  }

  // ---------- Языковой селектор ----------
  function setupLanguagePicker() {
    const sel = document.getElementById('languageSelect');
    if (!sel) return;
    sel.innerHTML = Object.entries(LANG_META)
      .map(([code, meta]) => `<option value="${code}">${meta.label}</option>`)
      .join('');
    sel.value = currentLang;
    sel.addEventListener('change', (e) => {
      currentLang = e.target.value;
      try { localStorage.setItem('vitro_lang', currentLang); } catch (err) {}
      _depthBaked = null; // лейблы анатомии перерисуются на новом языке
      applyTranslations();
    });
  }

  // ---------- Старт ----------
  setupLanguagePicker();
  setEnergy(3.0);
  setFocus(0.5);
  setSpot(8);
  setConv(16);
  startCase(0);
  applyTranslations();
  requestAnimationFrame((t) => { lastT = t; loop(t); });
})();
