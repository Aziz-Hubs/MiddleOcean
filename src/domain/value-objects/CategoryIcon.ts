/**
 * Value Object: CategoryIcon
 * 
 * Represents a Lucide icon name for category identification.
 * Enforces invariants: must be a valid Lucide icon identifier.
 */
export class CategoryIcon {
  private static readonly VALID_ICONS = [
    'Printer', 'Monitor', 'Cpu', 'HardDrive', 'Mouse', 'Keyboard', 'Scan', 'Film', 
    'Square', 'Circle', 'Triangle', 'Box', 'Zap', 'Settings', 'Wrench', 'Hand',
    'Palette', 'PenTool', 'Brush', 'Layer', 'Layers', 'Grid', 'Image', 'Speaker', 'Record',
    'Play', 'Pause', 'Stop', 'SkipForward', 'SkipBack', 'Shuffle', 'Repeat',
    'Volume2', 'Volume1', 'Volume', 'Mic2', 'Mic', 'Camera', 'Movie', 'Music',
    'BookOpen', 'FileText', 'FileImage', 'FileAudio', 'FileVideo', '_folder',
    'CheckCircle', 'CheckSquare', 'Clock', 'Calendar', '_TAG', ' TAGS', 'Search',
    'Home', 'Briefcase', 'Mail', 'Phone', 'MapPin', 'User', 'Users', 'MessageCircle',
    'ThumbsUp', 'ThumbsDown', 'Heart', 'Star', 'StarHalf', 'StarFull', 'AlertCircle',
    'AlertTriangle', 'CheckCircle2', 'CheckSquare2', 'XCircle', 'XSquare', 'Info',
    'HelpCircle', 'HelpCircle2', 'QrCode', 'Barcode', 'CreditCard', 'DollarSign',
    'Euro', 'Pound', 'Yen', 'Won', 'Ruble', 'Rupee', 'Lira', 'Franc', 'Krona',
    'Kwanza', 'Leke', 'Lempira', 'Lira', 'Naira', 'Peso', 'Real', 'Riel', 'Riyal',
    'Afghani', 'Bolivar', 'Cedi', 'Colon', 'Cordoba', 'Dong', 'Driven', 'Florin',
    'Guilder', 'Krone', 'Naira', 'Peso', 'Real', 'Riel', 'Riyal', 'Rubel',
    'Rupee', 'Shekel', 'Won', 'Yuan', 'Zloty', 'Package', 'Megaphone'
  ] as const;

  private readonly value: typeof CategoryIcon.VALID_ICONS[number];

  constructor(value: string) {
    const normalized = value.trim();
    
    if (!CategoryIcon.VALID_ICONS.includes(normalized as any)) {
      throw new Error(`Invalid icon name: "${value}". Must be a valid Lucide icon identifier.`);
    }
    
    this.value = normalized as typeof CategoryIcon.VALID_ICONS[number];
  }

  toString(): string {
    return this.value;
  }

  toComponent(): string {
    // Returns the component name for React imports
    return `icons/${this.value.toLowerCase()}`;
  }

  static fromString(value: string): CategoryIcon {
    return new CategoryIcon(value);
  }

  static fromSanity(value: string): CategoryIcon {
    return new CategoryIcon(value);
  }

  static isValid(icon: string): boolean {
    return CategoryIcon.VALID_ICONS.includes(icon as any);
  }
}
