// Unified Icon System - MathForce AI
// Using Lucide React for consistent visual language

import {
  Brain,
  BrainCircuit,
  BrainCog,
  Calculator,
  BookOpen,
  Zap,
  Timer,
  Puzzle,
  Target,
  ClipboardCheck,
  Microscope,
  GraduationCap,
  Scale,
  Globe,
  Users,
  Flag,
  Castle,
  Sparkles,
  FileText,
  Search,
  MessageSquare,
  Lightbulb,
  BarChart3,
  type LucideProps,
} from 'lucide-react'

// Standardized icon sizes
export const ICON_SIZES = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
  '2xl': 'w-10 h-10',
  '3xl': 'w-12 h-12',
} as const

// Standardized stroke width
export const STROKE_WIDTH = 1.75

// Icon wrapper component for consistent styling
interface IconWrapperProps {
  children: React.ReactNode
  size?: keyof typeof ICON_SIZES
  className?: string
  bgColor?: string
}

export function IconWrapper({ 
  children, 
  size = 'xl', 
  className = '',
  bgColor = 'bg-slate-900'
}: IconWrapperProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-14 h-14',
    '2xl': 'w-16 h-16',
    '3xl': 'w-20 h-20',
  }
  
  return (
    <div className={`${sizeClasses[size]} rounded-xl ${bgColor} flex items-center justify-center ${className}`}>
      {children}
    </div>
  )
}

// Module-specific icons with consistent props
const defaultProps: Partial<LucideProps> = {
  strokeWidth: STROKE_WIDTH,
  className: 'text-white',
}

// Elite Modeling - Brain with cog (advanced cognitive)
export function EliteIcon(props: LucideProps) {
  return <BrainCog {...defaultProps} {...props} />
}

// UNT Test - Clipboard check (exam)
export function UNTIcon(props: LucideProps) {
  return <ClipboardCheck {...defaultProps} {...props} />
}

// Micro Tests - Microscope (diagnostic)
export function MicroTestIcon(props: LucideProps) {
  return <Microscope {...defaultProps} {...props} />
}

// Worksheet - File text (documents)
export function WorksheetIcon(props: LucideProps) {
  return <FileText {...defaultProps} {...props} />
}

// Adaptive Training - Brain (learning)
export function TrainingIcon(props: LucideProps) {
  return <Brain {...defaultProps} {...props} />
}

// Logic Sprint - Puzzle (patterns)
export function LogicIcon(props: LucideProps) {
  return <Puzzle {...defaultProps} {...props} />
}

// Mental Math - Calculator (arithmetic)
export function MathIcon(props: LucideProps) {
  return <Calculator {...defaultProps} {...props} />
}

// Speech - Message square (speaking)
export function SpeechIcon(props: LucideProps) {
  return <MessageSquare {...defaultProps} {...props} />
}

// Reading - Book open (comprehension)
export function ReadingIcon(props: LucideProps) {
  return <BookOpen {...defaultProps} {...props} />
}

// Flash Memory - Brain circuit (memory)
export function MemoryIcon(props: LucideProps) {
  return <BrainCircuit {...defaultProps} {...props} />
}

// Reaction - Zap (speed)
export function ReactionIcon(props: LucideProps) {
  return <Zap {...defaultProps} {...props} />
}

// Story Cards - Sparkles (creativity)
export function CreativityIcon(props: LucideProps) {
  return <Sparkles {...defaultProps} {...props} />
}

// Spot Difference - Search (observation)
export function ObservationIcon(props: LucideProps) {
  return <Search {...defaultProps} {...props} />
}

// World Knowledge - Globe (knowledge)
export function KnowledgeIcon(props: LucideProps) {
  return <Globe {...defaultProps} {...props} />
}

// Team Strategy - Users (teamwork)
export function TeamIcon(props: LucideProps) {
  return <Users {...defaultProps} {...props} />
}

// Capture Flag - Flag (competition)
export function FlagIcon(props: LucideProps) {
  return <Flag {...defaultProps} {...props} />
}

// Castle Siege - Castle (strategy)
export function StrategyIcon(props: LucideProps) {
  return <Castle {...defaultProps} {...props} />
}

// Combo Rush - Timer (speed challenge)
export function TimerIcon(props: LucideProps) {
  return <Timer {...defaultProps} {...props} />
}

// Quick Judge - Scale (judgment)
export function JudgeIcon(props: LucideProps) {
  return <Scale {...defaultProps} {...props} />
}

// Sentence Puzzle - Lightbulb (understanding)
export function InsightIcon(props: LucideProps) {
  return <Lightbulb {...defaultProps} {...props} />
}

// Target - Target (accuracy)
export function TargetIcon(props: LucideProps) {
  return <Target {...defaultProps} {...props} />
}

// Stats - BarChart (results)
export function StatsIcon(props: LucideProps) {
  return <BarChart3 {...defaultProps} {...props} />
}

// Graduation - GraduationCap (education)
export function EducationIcon(props: LucideProps) {
  return <GraduationCap {...defaultProps} {...props} />
}

// Game card icon component for elementary games
interface GameCardIconProps {
  icon: React.ComponentType<LucideProps>
  color: string
  size?: 'sm' | 'md' | 'lg'
}

export function GameCardIcon({ icon: Icon, color, size = 'md' }: GameCardIconProps) {
  const sizeMap = {
    sm: { wrapper: 'w-10 h-10', icon: 'w-5 h-5' },
    md: { wrapper: 'w-12 h-12', icon: 'w-6 h-6' },
    lg: { wrapper: 'w-14 h-14', icon: 'w-7 h-7' },
  }
  
  return (
    <div className={`${sizeMap[size].wrapper} rounded-xl ${color} flex items-center justify-center`}>
      <Icon className={`${sizeMap[size].icon} text-white`} strokeWidth={STROKE_WIDTH} />
    </div>
  )
}

// Large module icon for main cards
interface ModuleIconProps {
  icon: React.ComponentType<LucideProps>
  bgColor?: string
  iconColor?: string
}

export function ModuleIcon({ icon: Icon, bgColor = 'bg-slate-900', iconColor = 'text-white' }: ModuleIconProps) {
  return (
    <div className={`w-16 h-16 rounded-xl ${bgColor} flex items-center justify-center`}>
      <Icon className={`w-8 h-8 ${iconColor}`} strokeWidth={STROKE_WIDTH} />
    </div>
  )
}

// Page header icon
interface PageHeaderIconProps {
  icon: React.ComponentType<LucideProps>
  color?: string
}

export function PageHeaderIcon({ icon: Icon, color = 'text-slate-700' }: PageHeaderIconProps) {
  return <Icon className={`w-16 h-16 ${color}`} strokeWidth={1.5} />
}

// Re-export all icons for direct use
export {
  Brain,
  BrainCircuit,
  BrainCog,
  Calculator,
  BookOpen,
  Zap,
  Timer,
  Puzzle,
  Target,
  ClipboardCheck,
  Microscope,
  GraduationCap,
  Scale,
  Globe,
  Users,
  Flag,
  Castle,
  Sparkles,
  FileText,
  Search,
  MessageSquare,
  Lightbulb,
  BarChart3,
}
