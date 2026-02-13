'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface Stat {
    icon: string;
    value: string;
    label: string;
}

interface Value {
    icon: string;
    title: string;
    desc: string;
}

interface TeamMember {
    name: string;
    role: string;
    bio: string;
}

interface AboutUsData {
    title: string;
    subtitle: string;
    content: string[];
    stats: Stat[];
    values: Value[];
    certifications: string[];
    team: TeamMember[];
    vision: {
        title: string;
        text: string;
    };
}

const initialData: AboutUsData = {
    title: '',
    subtitle: '',
    content: [],
    stats: [],
    values: [],
    certifications: [],
    team: [],
    vision: { title: '', text: '' }
}

export default function EditAboutPage() {
    const [data, setData] = useState<AboutUsData>(initialData)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const router = useRouter()

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const res = await fetch('/api/admin/settings')
            const json = await res.json()
            if (json.data && json.data.site_about_us) {
                setData(json.data.site_about_us)
            }
        } catch (error) {
            toast.error('Failed to load data')
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ site_about_us: data })
            })

            if (res.ok) {
                toast.success('About Us page updated successfully')
                router.refresh()
            } else {
                throw new Error('Failed to save')
            }
        } catch (error) {
            toast.error('Failed to save changes')
        } finally {
            setSaving(false)
        }
    }

    const updateContent = (index: number, value: string) => {
        const newContent = [...data.content]
        newContent[index] = value
        setData({ ...data, content: newContent })
    }

    const addContentParagraph = () => {
        setData({ ...data, content: [...data.content, ''] })
    }

    const removeContentParagraph = (index: number) => {
        const newContent = data.content.filter((_, i) => i !== index)
        setData({ ...data, content: newContent })
    }

    // Helper for updating array items
    const updateItem = <T,>(arr: T[], index: number, field: keyof T, value: string, key: 'stats' | 'values' | 'team') => {
        const newArr = [...arr]
        newArr[index] = { ...newArr[index], [field]: value }
        setData({ ...data, [key]: newArr })
    }

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-20">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Edit About Us Page</h1>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 rounded-lg hover:bg-neutral-800 disabled:opacity-50"
                >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Changes
                </button>
            </div>

            {/* Main Section */}
            <div className="bg-white p-6 rounded-lg border border-neutral-200 space-y-4">
                <h2 className="text-lg font-semibold">Hero Section</h2>
                <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                        type="text"
                        value={data.title}
                        onChange={(e) => setData({ ...data, title: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Subtitle</label>
                    <textarea
                        value={data.subtitle}
                        onChange={(e) => setData({ ...data, subtitle: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                        rows={2}
                    />
                </div>
            </div>

            {/* Content Section */}
            <div className="bg-white p-6 rounded-lg border border-neutral-200 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Our Story Content</h2>
                    <button onClick={addContentParagraph} className="text-sm text-blue-600 flex items-center gap-1"><Plus className="h-4 w-4" /> Add Paragraph</button>
                </div>
                {data.content.map((paragraph, index) => (
                    <div key={index} className="flex gap-2">
                        <textarea
                            value={paragraph}
                            onChange={(e) => updateContent(index, e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg"
                            rows={3}
                        />
                        <button onClick={() => removeContentParagraph(index)} className="text-red-500 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Vision Section */}
            <div className="bg-white p-6 rounded-lg border border-neutral-200 space-y-4">
                <h2 className="text-lg font-semibold">Vision</h2>
                <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                        type="text"
                        value={data.vision.title}
                        onChange={(e) => setData({ ...data, vision: { ...data.vision, title: e.target.value } })}
                        className="w-full px-3 py-2 border rounded-lg"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Text</label>
                    <textarea
                        value={data.vision.text}
                        onChange={(e) => setData({ ...data, vision: { ...data.vision, text: e.target.value } })}
                        className="w-full px-3 py-2 border rounded-lg"
                        rows={3}
                    />
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-white p-6 rounded-lg border border-neutral-200 space-y-4">
                <h2 className="text-lg font-semibold">Statistics</h2>
                <div className="grid grid-cols-2 gap-4">
                    {data.stats.map((stat, index) => (
                        <div key={index} className="border p-4 rounded-lg space-y-2">
                            <input
                                placeholder="Value (e.g. 50,000+)"
                                value={stat.value}
                                onChange={(e) => updateItem(data.stats, index, 'value', e.target.value, 'stats')}
                                className="w-full px-2 py-1 border rounded"
                            />
                            <input
                                placeholder="Label"
                                value={stat.label}
                                onChange={(e) => updateItem(data.stats, index, 'label', e.target.value, 'stats')}
                                className="w-full px-2 py-1 border rounded"
                            />
                            <input
                                placeholder="Icon Name (Lucide)"
                                value={stat.icon}
                                onChange={(e) => updateItem(data.stats, index, 'icon', e.target.value, 'stats')}
                                className="w-full px-2 py-1 border rounded"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Values Section */}
            <div className="bg-white p-6 rounded-lg border border-neutral-200 space-y-4">
                <h2 className="text-lg font-semibold">Values</h2>
                <div className="space-y-4">
                    {data.values.map((val, index) => (
                        <div key={index} className="border p-4 rounded-lg space-y-2">
                            <input
                                placeholder="Title"
                                value={val.title}
                                onChange={(e) => updateItem(data.values, index, 'title', e.target.value, 'values')}
                                className="w-full px-2 py-1 border rounded font-medium"
                            />
                            <textarea
                                placeholder="Description"
                                value={val.desc}
                                onChange={(e) => updateItem(data.values, index, 'desc', e.target.value, 'values')}
                                className="w-full px-2 py-1 border rounded"
                                rows={2}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Certifications - Simple list for now */}
            <div className="bg-white p-6 rounded-lg border border-neutral-200 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Certifications</h2>
                    <button onClick={() => setData({ ...data, certifications: [...data.certifications, ''] })} className="text-sm text-blue-600 flex items-center gap-1"><Plus className="h-4 w-4" /> Add</button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {data.certifications.map((cert, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                value={cert}
                                onChange={(e) => {
                                    const newCerts = [...data.certifications]
                                    newCerts[index] = e.target.value
                                    setData({ ...data, certifications: newCerts })
                                }}
                                className="w-full px-2 py-1 border rounded"
                            />
                            <button onClick={() => {
                                const newCerts = data.certifications.filter((_, i) => i !== index)
                                setData({ ...data, certifications: newCerts })
                            }} className="text-red-500"><Trash2 className="h-4 w-4" /></button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Team Section */}
            <div className="bg-white p-6 rounded-lg border border-neutral-200 space-y-4">
                <h2 className="text-lg font-semibold">Team Members</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    {data.team.map((member, index) => (
                        <div key={index} className="border p-4 rounded-lg space-y-2">
                            <input
                                placeholder="Name"
                                value={member.name}
                                onChange={(e) => updateItem(data.team, index, 'name', e.target.value, 'team')}
                                className="w-full px-2 py-1 border rounded font-bold"
                            />
                            <input
                                placeholder="Role"
                                value={member.role}
                                onChange={(e) => updateItem(data.team, index, 'role', e.target.value, 'team')}
                                className="w-full px-2 py-1 border rounded text-sm"
                            />
                            <textarea
                                placeholder="Bio"
                                value={member.bio}
                                onChange={(e) => updateItem(data.team, index, 'bio', e.target.value, 'team')}
                                className="w-full px-2 py-1 border rounded text-sm"
                                rows={2}
                            />
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}
