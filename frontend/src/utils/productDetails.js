/**
 * Mapeo de fotografías reales de alta resolución (Unsplash optimizadas)
 * y descripciones sensoriales gastronómicas para los productos de Café Aurora.
 */

export const CATEGORY_FALLBACK_IMAGES = {
  'Bebidas Calientes':
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&h=375&q=80',
  'Bebidas Frías':
    'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&h=375&q=80',
  'Tés y Especiales':
    'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&h=375&q=80',
  Repostería:
    'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&h=375&q=80',
  'Brunch y Salados':
    'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&h=375&q=80',
}

const DEFAULT_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&h=375&q=80'

export const HERO_BACKGROUND_IMAGE =
  'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1800&q=85'

/**
 * Catálogo detallado con imagen fotográfica exacta y notas sensoriales.
 */
export const PRODUCT_META_BY_NAME = {
  // Bebidas Calientes
  Espresso: {
    image:
      'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Extracción pura y concentrada con crema densa color avellana y notas a chocolate amargo.',
    tastingNotes: ['Crema densa', 'Cacao puro', 'Cuerpo pleno'],
  },
  Capuchino: {
    image:
      'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Equilibrio perfecto de espresso tostado medio, leche vaporizada y microespuma aterciopelada.',
    tastingNotes: ['Microespuma sedosa', 'Equilibrado', 'Toque de canela'],
  },
  'Latte Vainilla': {
    image:
      'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Leche texturizada con extracto natural de vainilla de Madagascar y espresso suave de altura.',
    tastingNotes: ['Vainilla natural', 'Textura cremosa', 'Dulzura suave'],
  },
  'Espresso Doble Reserva': {
    image:
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Doble extracción de granos de especialidad de Tarrazú con acidez brillante y final prolongado.',
    tastingNotes: ['Tarrazú Reserva', 'Acidez cítrica', 'Final prolongado'],
  },
  'Americano Clásico': {
    image:
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Espresso diluido en agua a temperatura controlada para resaltar las notas frutales y florales.',
    tastingNotes: ['Cuerpo ligero', 'Notas florales', 'Suave en paladar'],
  },
  'Flat White Australiano': {
    image:
      'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Ristretto doble cubierto con una fina capa de leche cremosa emulsionada a 65°C.',
    tastingNotes: ['Doble ristretto', 'Microfoam denso', 'Intensidad media'],
  },
  'Cortado Tradicional': {
    image:
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Partes iguales de espresso aromático y leche tibia servido en clásico vaso de vidrio templado.',
    tastingNotes: ['Proporción 1:1', 'Sabor equilibrado', 'Cálido'],
  },
  'Mocha Chocolate Oscuro': {
    image:
      'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Chocolate costarricense 70% fundido al vapor con espresso y leche entera texturizada.',
    tastingNotes: ['Cacao 70%', 'Indulgente', 'Toque de nuez moscada'],
  },
  'Caramel Macchiato': {
    image:
      'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Vainilla suave con leche espumada, sellada con una cascada de espresso y toffee artesanal.',
    tastingNotes: ['Caramelo salado', 'Vainilla cremosa', 'Capas visuales'],
  },
  'Dirty Chai Latte': {
    image:
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Infusión especiada con cardamomo, jengibre y clavo, energizada con un shot de espresso.',
    tastingNotes: ['Especias de la India', 'Shot espresso', 'Reconfortante'],
  },
  'Latte de Avellana Tostada': {
    image:
      'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Jarabe de avellanas tostadas a fuego lento combinado con espresso aterciopelado.',
    tastingNotes: ['Avellana tostada', 'Aroma amaderado', 'Textura rica'],
  },
  'Café Filtrado V60 Geisha': {
    image:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Método de goteo manual para variedad Geisha con notas de jazmín, bergamota y miel de caña.',
    tastingNotes: ['Geisha Especialidad', 'Notas de jazmín', 'Cítricos dulces'],
  },
  'Chemex Tradicional (2 Tazas)': {
    image:
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Filtrado de doble papel que produce una taza limpia, brillante y libre de sedimentos.',
    tastingNotes: ['Claridad cristalina', 'Para compartir', 'Aromas frutales'],
  },

  // Bebidas Frías
  'Cold Brew Nitro Suave': {
    image:
      'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Café macerado en frío 20 horas e infusionado con nitrógeno para un efecto cascada y cuerpo cremoso.',
    tastingNotes: ['Efecto cascada', 'Naturalmente dulce', 'Baja acidez'],
  },
  'Iced Vanilla Latte': {
    image:
      'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Espresso servido sobre cubos de hielo transparentes, leche fresca y toque de vainilla bourbon.',
    tastingNotes: ['Ultra refrescante', 'Vainilla suave', 'Capas marmoladas'],
  },
  'Iced Caramel Macchiato': {
    image:
      'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Leche fría con hielo artesanal, inyección de espresso y terminado con caramelo dorado.',
    tastingNotes: ['Toffee frío', 'Dulce tentación', 'Contraste térmico'],
  },
  'Cold Brew Tonic Cítrico': {
    image:
      'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Agua tónica efervescente con infusión de cold brew concentrado y rodajas de naranja dulce.',
    tastingNotes: ['Burbujas finas', 'Cítrico energizante', 'Notas botánicas'],
  },
  'Frappé Moka Intenso': {
    image:
      'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Hielo triturado con doble espresso, chocolate de origen y corona de chantilly artesanal.',
    tastingNotes: ['Frappé helado', 'Cacao intenso', 'Crema chantilly'],
  },
  'Frappé Caramelo & Toffee': {
    image:
      'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Granizado sedoso de café con caramelo mantecoso y crujiente de galleta toffee.',
    tastingNotes: ['Crunch de toffee', 'Textura frappé', 'Dulzura dorada'],
  },
  'Affogato Espresso & Vainilla': {
    image:
      'https://images.unsplash.com/photo-1594911772125-07fc7a2d8d9f?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Una bola de helado artesanal de vainilla italiana bañada en un shot hirviendo de espresso recién extraído.',
    tastingNotes: ['Gelato artesanal', 'Choque frío-calor', 'Postre & café'],
  },
  'Iced Americano Clásico': {
    image:
      'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Doble shot de espresso sobre abundante hielo cristalino y agua purificada.',
    tastingNotes: ['Cero azúcar', 'Estimulante puro', 'Perfil limpio'],
  },
  'Cold Brew con Crema Dulce': {
    image:
      'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Maceración en frío de 18 horas coronada con suave espuma de crema dulce aromatizada.',
    tastingNotes: ['Sweet cold foam', 'Cuerpo cremoso', 'Contrastes'],
  },
  'Tónico de Espresso & Naranja': {
    image:
      'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Tónica premiun con zumo fresco de naranja agridulce y capa flotante de espresso de finca.',
    tastingNotes: ['Naranja fresca', 'Amargor sutil', 'Refrescante'],
  },

  // Tés y Especiales
  'Matcha Latte Ceremonial': {
    image:
      'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Matcha Uji grado ceremonial batido tradicionalmente con chasen y leche de avena al vapor.',
    tastingNotes: ['Grado Ceremonial Uji', 'Antioxidantes', 'Dulzor vegetal'],
  },
  'Iced Matcha de Avena': {
    image:
      'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Gradiente visual esmeralda con leche de avena fría, matcha puro y sirope de agave orgánico.',
    tastingNotes: ['Leche de avena', 'Energía limpia', 'Refrescante'],
  },
  'Chai Latte Especiado': {
    image:
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Mezcla artesanal de té negro con canela, anís estrellado, clavo, pimienta rosa y leche espumada.',
    tastingNotes: ['Aroma a especias', 'Canela en rama', 'Cálido abrazo'],
  },
  'Golden Milk Cúrcuma & Miel': {
    image:
      'https://images.unsplash.com/photo-1615478503562-ec2d8aa0e24e?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Leche dorada con raíz de cúrcuma orgánica, jengibre, miel pura de abeja y un toque de pimienta.',
    tastingNotes: ['Cúrcuma pura', 'Propiedades antiinflamatorias', 'Miel pura'],
  },
  'Té Verde Sencha Orgánico': {
    image:
      'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Hojas enteras seleccionadas de té verde japonés al vapor con aroma herbal y notas umami.',
    tastingNotes: ['Sencha japonés', 'Herbal fresco', 'Cuerpo ligero'],
  },
  'Infusión Frutos del Bosque': {
    image:
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Tisana libre de teína con moras silvestres, frambuesas deshidratadas, flor de hibisco y manzana.',
    tastingNotes: ['Sin cafeína', 'Color rubí vivo', 'Frutal dulce'],
  },
  'Té Negro Earl Grey': {
    image:
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Clásico té negro ceilán aromatizado con aceite esencial de bergamota de Calabria.',
    tastingNotes: ['Aceite de bergamota', 'Ceilán aromático', 'Elegante'],
  },
  'Chocolate Caliente Artesanal': {
    image:
      'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Pastillas de chocolate oscuro 70% derretidas en leche entera cremosa con un toque de vainilla.',
    tastingNotes: ['Cacao criollo', 'Ultra espeso', 'Puro confort'],
  },
  'Infusión Manzanilla & Lavanda': {
    image:
      'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Flores enteras de manzanilla silvestre y pétalos de lavanda francesa para una relajación total.',
    tastingNotes: ['Flores enteras', 'Lavanda relajante', 'Sin cafeína'],
  },
  'Matcha Tonic Refrescante': {
    image:
      'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Matcha batido en frío que cae en cascada sobre agua tónica burbujeante y rodaja de limón sutil.',
    tastingNotes: ['Efervescente', 'Burbujas verdes', 'Cítrico vivaz'],
  },

  // Repostería
  'Croissant Horneado': {
    image:
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Hojaldre francés tradicional con mantequilla de campo, crujiente por fuera y tierno en su interior.',
    tastingNotes: ['Laminado a mano', '100% mantequilla', 'Crocante dorado'],
  },
  'Croissant de Almendras': {
    image:
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Relleno de crema frangipane de almendras tostadas, bañado en almíbar y almendras fileteadas.',
    tastingNotes: ['Crema frangipane', 'Almendras tostadas', 'Azúcar glas'],
  },
  'Pain au Chocolat Francés': {
    image:
      'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Masa hojaldrada envolviendo dos barras de chocolate belga semi-amargo que se funden al calor.',
    tastingNotes: ['Chocolate belga', 'Hojaldrado fino', 'Clásico parisino'],
  },
  'Cinnamon Roll Glaseado': {
    image:
      'https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Masa suave de brioche especiada con canela de Ceilán y cubierta con glaseado de queso crema.',
    tastingNotes: ['Canela aromática', 'Glaseado de queso', 'Masa tibia esponjosa'],
  },
  'Cheesecake de Frutos Rojos': {
    image:
      'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Tarta clásica de queso cremosa horneada lentamente sobre base de galleta de mantequilla y salsa de frutos del bosque.',
    tastingNotes: ['Coulis de frutos rojos', 'Cremoso estilo NY', 'Base crujiente'],
  },
  'Tarta de Zanahoria & Nuez': {
    image:
      'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Bizcocho húmedo con especias, zanahoria rallada, nueces de nogal y frosting aterciopelado de queso crema.',
    tastingNotes: ['Nueces pecanas', 'Frosting suave', 'Especias cálidas'],
  },
  'Brownie Fudge con Sal Marina': {
    image:
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Textura fudgy ultrachocolatosa con escamas de sal marina que equilibran su rica dulzura.',
    tastingNotes: ['Corazón húmedo', 'Sal marina escamosa', 'Chocolate 70%'],
  },
  'Muffin de Arándanos Silvestres': {
    image:
      'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Muffin esponjoso colmado de arándanos frescos que explotan con cada mordida y cubierta streusel crujiente.',
    tastingNotes: ['Arándanos frescos', 'Streusel crujiente', 'Vainilla suave'],
  },
  'Galleta Chispas de Chocolate': {
    image:
      'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Horneada a diario: bordes crujientes dorados, centro meloso y abundantes chispas de chocolate.',
    tastingNotes: ['Centro meloso', 'Mantequilla tostada', 'Gotas de chocolate'],
  },
  'Alfajor de Dulce de Leche': {
    image:
      'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Tapas de maicena que se deshacen en la boca, generoso relleno de dulce de leche artesanal y coco rallado.',
    tastingNotes: ['Dulce de leche repostero', 'Coco rallado', 'Se deshace'],
  },
  'Dona Rellena de Nutella': {
    image:
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Masa brioche esponjosa frita en punto exacto, rellena con crema de avellana y espolvoreada con azúcar fina.',
    tastingNotes: ['Relleno de avellanas', 'Masa tierna', 'Glaseado fino'],
  },

  // Brunch y Salados
  'Tostada de Aguacate & Huevo': {
    image:
      'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Pan rústico de masa madre con aguacate machacado al limón, huevo pochado al punto y semillas de sésamo.',
    tastingNotes: ['Masa madre crujiente', 'Huevo pochado', 'Aguacate cremoso'],
  },
  'Sandwich Jamón Serrano & Queso': {
    image:
      'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Baguette artesanal con jamón serrano curado, queso manchego fundido, tomate rallado y aceite de oliva virgen extra.',
    tastingNotes: ['Jamón serrano reserva', 'Manchego curado', 'AOVE español'],
  },
  'Bagel de Salmón Ahumado': {
    image:
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Bagel de semillas tostado con queso crema de eneldo fresco, láminas de salmón noruego ahumado y alcaparras.',
    tastingNotes: ['Salmón noruego', 'Queso al eneldo', 'Alcaparras ácidas'],
  },
  'Sándwich de Pollo al Pesto': {
    image:
      'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Pechuga de pollo marinada a las hierbas, pesto genovés de albahaca fresca, tomates secos y mozzarella en pan ciabatta.',
    tastingNotes: ['Pesto casero', 'Ciabatta tostada', 'Mozzarella fundida'],
  },
  'Croissant Relleno Jamón y Queso': {
    image:
      'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Croissant recién horneado a la mantequilla, relleno con jamón selva negra y queso gouda derretido al horno.',
    tastingNotes: ['Mantequilla & hojaldre', 'Gouda fundido', 'Jamón selva negra'],
  },
  'Bowl de Yogurt Griego & Granola': {
    image:
      'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Yogurt griego espeso natural con granola artesanal horneada con frutos secos, arándanos, fresas y miel.',
    tastingNotes: ['Yogurt griego espeso', 'Granola crocante', 'Frutos rojos frescos'],
  },
  'Quiche Lorraine Espinaca & Queso': {
    image:
      'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Masa quebrada rellena de suave crema pastelera salada, hojas tiernas de espinaca salteada y queso emmental gratinado.',
    tastingNotes: ['Masa quebrada', 'Espinacas tiernas', 'Emmental dorado'],
  },
  'Empanada Gallega de Carne': {
    image:
      'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Masa fina dorada rellena con carne de res picada a cuchillo, sofrito de cebollas caramelizadas y pimentón dulce.',
    tastingNotes: ['Carne jugosa', 'Sofrito de pimientos', 'Masa dorada al horno'],
  },
  'Tostada Francesa con Miel de Maple': {
    image:
      'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Gruesas rebanadas de pan brioche bañadas en natilla de vainilla, doradas con mantequilla y bañadas en sirope puro de arce.',
    tastingNotes: ['Brioche suave', 'Sirope de arce puro', 'Frutos del bosque'],
  },
  'Grilled Cheese Trufado': {
    image:
      'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&h=375&q=80',
    description: 'Tres quesos madurados (Cheddar añejo, Gruyère y Mozzarella) fundidos en pan campesino con toque de aceite de trufa blanca.',
    tastingNotes: ['Quesos derretidos', 'Aceite de trufa', 'Dorado crocante'],
  },
}

/**
 * Obtiene la metadata enriquecida de un producto (foto de alta calidad,
 * descripción sensorial y etiquetas de cata) con fallbacks elegantes.
 */
export function getProductDetails(producto) {
  if (!producto) {
    return {
      image: DEFAULT_FALLBACK_IMAGE,
      description: 'Elaborado artesanalmente con ingredientes frescos y seleccionados.',
      tastingNotes: ['Artesanal', 'Fresco'],
    }
  }

  const exactMeta = PRODUCT_META_BY_NAME[producto.nombre]
  if (exactMeta) {
    return exactMeta
  }

  // Búsqueda por coincidencia parcial de nombre
  const lowerName = producto.nombre.toLowerCase()
  for (const [name, meta] of Object.entries(PRODUCT_META_BY_NAME)) {
    if (lowerName.includes(name.toLowerCase()) || name.toLowerCase().includes(lowerName)) {
      return meta
    }
  }

  // Fallback por categoría
  const categoryImage =
    CATEGORY_FALLBACK_IMAGES[producto.categoria] ?? DEFAULT_FALLBACK_IMAGE

  return {
    image: categoryImage,
    description: `Deliciosa creación artesanal de nuestra categoría de ${producto.categoria}, preparada al momento con insumos de alta calidad.`,
    tastingNotes: ['Artesanal', 'Preparación fresca', producto.categoria],
  }
}
