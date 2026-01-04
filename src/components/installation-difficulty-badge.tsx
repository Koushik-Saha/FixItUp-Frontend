'use client'

import { Clock, Wrench, AlertTriangle, CheckCircle, Info } from 'lucide-react'

type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert'

interface InstallationDifficultyBadgeProps {
    difficulty: DifficultyLevel
    estimatedTime?: string
    requiredTools?: string[]
    showDetails?: boolean
    size?: 'sm' | 'md' | 'lg'
}

const DIFFICULTY_CONFIG = {
    easy: {
        label: 'Easy',
        color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700',
        icon: CheckCircle,
        description: 'Basic skills required. Perfect for beginners.',
        skillLevel: 'Beginner friendly'
    },
    medium: {
        label: 'Medium',
        color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700',
        icon: Info,
        description: 'Some technical knowledge helpful.',
        skillLevel: 'Intermediate'
    },
    hard: {
        label: 'Hard',
        color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700',
        icon: AlertTriangle,
        description: 'Advanced skills required. Take your time.',
        skillLevel: 'Advanced'
    },
    expert: {
        label: 'Expert',
        color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700',
        icon: AlertTriangle,
        description: 'Professional experience recommended.',
        skillLevel: 'Expert only'
    }
}

const DEFAULT_TOOLS = {
    easy: ['Phillips screwdriver', 'Plastic pry tool'],
    medium: ['Precision screwdriver set', 'Plastic pry tools', 'Suction cup'],
    hard: ['Complete repair toolkit', 'Heat gun', 'Tweezers', 'Spudger'],
    expert: ['Professional repair station', 'Specialized tools', 'Heat gun', 'Microscope']
}

export default function InstallationDifficultyBadge({
    difficulty,
    estimatedTime,
    requiredTools,
    showDetails = false,
    size = 'md'
}: InstallationDifficultyBadgeProps) {
    const config = DIFFICULTY_CONFIG[difficulty]
    const Icon = config.icon
    const tools = requiredTools || DEFAULT_TOOLS[difficulty]

    const sizeClasses = {
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-3 py-1.5',
        lg: 'text-base px-4 py-2'
    }

    const iconSizes = {
        sm: 'h-3 w-3',
        md: 'h-4 w-4',
        lg: 'h-5 w-5'
    }

    if (!showDetails) {
        // Compact badge
        return (
            <div className={`inline-flex items-center gap-2 rounded-lg border ${config.color} ${sizeClasses[size]} font-medium`}>
                <Icon className={iconSizes[size]} />
                <span>{config.label}</span>
            </div>
        )
    }

    // Detailed view with time and tools
    return (
        <div className={`rounded-lg border ${config.color} p-4`}>
            <div className="flex items-start gap-3 mb-3">
                <div className={`p-2 rounded-lg ${config.color}`}>
                    <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-base">
                            {config.label} Installation
                        </h4>
                        <span className="text-xs opacity-75">({config.skillLevel})</span>
                    </div>
                    <p className="text-sm opacity-90">
                        {config.description}
                    </p>
                </div>
            </div>

            {/* Time Estimate */}
            {estimatedTime && (
                <div className="flex items-center gap-2 mb-3 text-sm">
                    <Clock className="h-4 w-4 opacity-75" />
                    <span className="font-medium">Estimated Time:</span>
                    <span>{estimatedTime}</span>
                </div>
            )}

            {/* Required Tools */}
            {tools && tools.length > 0 && (
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <Wrench className="h-4 w-4 opacity-75" />
                        <span>Required Tools:</span>
                    </div>
                    <ul className="ml-6 space-y-1">
                        {tools.map((tool, index) => (
                            <li key={index} className="text-sm flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-current opacity-50"></span>
                                {tool}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
