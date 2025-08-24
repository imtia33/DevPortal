"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Card, CardContent } from "./ui/card"
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons'
import { POPULAR_ICONS, ICON_FAMILIES } from "../imports/expoIcons"
// All icons now use Expo Vector Icons

// Tag and data structure definitions

/* Updated tag categories to use Expo Vector Icons */
const TAG_CATEGORIES = {
  Platforms: [
    { name: "Apple", defaultIcon: "ios-apple", iconFamily: "ionicons", defaultColor: "#374151" },
    { name: "Android", defaultIcon: "ios-phone-portrait", iconFamily: "ionicons", defaultColor: "#22c55e" },
    { name: "Web", defaultIcon: "ios-globe", iconFamily: "ionicons", defaultColor: "#3b82f6" },
    { name: "Windows", defaultIcon: "ios-desktop", iconFamily: "ionicons", defaultColor: "#0ea5e9" },
    { name: "Linux", defaultIcon: "ios-terminal", iconFamily: "ionicons", defaultColor: "#f59e0b" },
    { name: "macOS", defaultIcon: "ios-apple", iconFamily: "ionicons", defaultColor: "#6b7280" },
    { name: "iOS", defaultIcon: "ios-phone-portrait", iconFamily: "ionicons", defaultColor: "#374151" },
  ],
  Languages: [
    { name: "JavaScript", defaultIcon: "ios-code", iconFamily: "ionicons", defaultColor: "#f59e0b" },
    { name: "TypeScript", defaultIcon: "ios-code", iconFamily: "ionicons", defaultColor: "#3b82f6" },
    { name: "Python", defaultIcon: "ios-code", iconFamily: "ionicons", defaultColor: "#22c55e" },
    { name: "C++", defaultIcon: "ios-cpu", iconFamily: "ionicons", defaultColor: "#ef4444" },
    { name: "Java", defaultIcon: "ios-code", iconFamily: "ionicons", defaultColor: "#f97316" },
    { name: "Ruby", defaultIcon: "ios-code", iconFamily: "ionicons", defaultColor: "#dc2626" },
    { name: "Go", defaultIcon: "ios-flash", iconFamily: "ionicons", defaultColor: "#06b6d4" },
    { name: "PHP", defaultIcon: "ios-code", iconFamily: "ionicons", defaultColor: "#8b5cf6" },
    { name: "Swift", defaultIcon: "ios-code", iconFamily: "ionicons", defaultColor: "#f97316" },
    { name: "Kotlin", defaultIcon: "ios-code", iconFamily: "ionicons", defaultColor: "#8b5cf6" },
    { name: "Rust", defaultIcon: "ios-shield", iconFamily: "ionicons", defaultColor: "#dc2626" },
    { name: "Dart", defaultIcon: "ios-code", iconFamily: "ionicons", defaultColor: "#06b6d4" },
    { name: "C#", defaultIcon: "ios-code", iconFamily: "ionicons", defaultColor: "#8b5cf6" },
  ],
  Frameworks: [
    { name: "React", defaultIcon: "ios-layers", iconFamily: "ionicons", defaultColor: "#06b6d4" },
    { name: "Angular", defaultIcon: "ios-cube", iconFamily: "ionicons", defaultColor: "#dc2626" },
    { name: "Vue", defaultIcon: "ios-layers", iconFamily: "ionicons", defaultColor: "#22c55e" },
    { name: "Next.js", defaultIcon: "ios-flash", iconFamily: "ionicons", defaultColor: "#374151" },
    { name: "Flutter", defaultIcon: "ios-phone-portrait", iconFamily: "ionicons", defaultColor: "#3b82f6" },
    { name: "Express", defaultIcon: "ios-code", iconFamily: "ionicons", defaultColor: "#374151" },
    { name: "Django", defaultIcon: "ios-code", iconFamily: "ionicons", defaultColor: "#22c55e" },
    { name: "Laravel", defaultIcon: "ios-code", iconFamily: "ionicons", defaultColor: "#ef4444" },
  ],
  Databases: [
    { name: "MongoDB", defaultIcon: "ios-database", iconFamily: "ionicons", defaultColor: "#22c55e" },
    { name: "PostgreSQL", defaultIcon: "ios-database", iconFamily: "ionicons", defaultColor: "#3b82f6" },
    { name: "MySQL", defaultIcon: "ios-database", iconFamily: "ionicons", defaultColor: "#f97316" },
    { name: "SQLite", defaultIcon: "ios-database", iconFamily: "ionicons", defaultColor: "#6b7280" },
    { name: "Redis", defaultIcon: "ios-database", iconFamily: "ionicons", defaultColor: "#dc2626" },
    { name: "Firebase", defaultIcon: "ios-cloud", iconFamily: "ionicons", defaultColor: "#f59e0b" },
    { name: "Supabase", defaultIcon: "ios-database", iconFamily: "ionicons", defaultColor: "#22c55e" },
  ],
  Tools: [
    { name: "Docker", defaultIcon: "ios-cube", iconFamily: "ionicons", defaultColor: "#06b6d4" },
    { name: "Kubernetes", defaultIcon: "ios-settings", iconFamily: "ionicons", defaultColor: "#3b82f6" },
    { name: "Git", defaultIcon: "ios-git-branch", iconFamily: "ionicons", defaultColor: "#f97316" },
    { name: "Webpack", defaultIcon: "ios-construct", iconFamily: "ionicons", defaultColor: "#8b5cf6" },
    { name: "Vite", defaultIcon: "ios-flash", iconFamily: "ionicons", defaultColor: "#8b5cf6" },
    { name: "Figma", defaultIcon: "ios-layers", iconFamily: "ionicons", defaultColor: "#ef4444" },
  ],
}

/* Updated icon library to use Expo Vector Icons */
const ICON_LIBRARY = [
  { name: "ios-code", component: Ionicons, family: "ionicons" },
  { name: "ios-database", component: Ionicons, family: "ionicons" },
  { name: "ios-globe", component: Ionicons, family: "ionicons" },
  { name: "ios-phone-portrait", component: Ionicons, family: "ionicons" },
  { name: "ios-desktop", component: Ionicons, family: "ionicons" },
  { name: "ios-cloud", component: Ionicons, family: "ionicons" },
  { name: "ios-shield", component: Ionicons, family: "ionicons" },
  { name: "ios-flash", component: Ionicons, family: "ionicons" },
  { name: "ios-star", component: Ionicons, family: "ionicons" },
  { name: "ios-heart", component: Ionicons, family: "ionicons" },
  { name: "ios-layers", component: Ionicons, family: "ionicons" },
  { name: "ios-cube", component: Ionicons, family: "ionicons" },
  { name: "ios-settings", component: Ionicons, family: "ionicons" },
  { name: "ios-terminal", component: Ionicons, family: "ionicons" },
  { name: "ios-git-branch", component: Ionicons, family: "ionicons" },
  { name: "ios-cpu", component: Ionicons, family: "ionicons" },
  { name: "ios-construct", component: Ionicons, family: "ionicons" },
  { name: "ios-apple", component: Ionicons, family: "ionicons" }
]

const demoTypes = [
  { type: "web", label: "Website", icon: Ionicons, iconName: "ios-globe", color: "bg-blue-100 text-blue-700 hover:bg-blue-200" },
  { type: "github", label: "GitHub", icon: Ionicons, iconName: "ios-logo-github", color: "bg-gray-100 text-gray-700 hover:bg-gray-200" },
  {
    type: "googleplay",
    label: "Google Play",
    icon: Ionicons,
    iconName: "ios-phone-portrait",
    color: "bg-green-100 text-green-700 hover:bg-green-200",
  },
  {
    type: "applestore",
    label: "App Store",
    icon: Ionicons,
    iconName: "ios-apple",
    color: "bg-gray-100 text-gray-700 hover:bg-gray-200",
  },
]

/* Added predefined color palette for tag customization */
const COLOR_PALETTE = [
  "#374151",
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
]

export default function ShowoffMaker() {
  const [showoffData, setShowoffData] = useState({
    title: "",
    tagline: "",
    coverImageUrl: "",
    tags: [],
    description: "",
    demo: [],
  })

  const [isTagModalOpen, setIsTagModalOpen] = useState(false)
  const [isIconModalOpen, setIsIconModalOpen] = useState(false)
  const [isColorModalOpen, setIsColorModalOpen] = useState(false)
  const [selectedTagForCustomization, setSelectedTagForCustomization] = useState(null)
  const [customColor, setCustomColor] = useState("#374151")

  /* Enhanced tag addition with proper structure */
  const addTag = (tagData, category) => {
    const newTag = {
      name: tagData.name,
      iconName: tagData.defaultIcon,
      iconFamily: tagData.iconFamily,
      color: tagData.defaultColor,
    }

    if (!showoffData.tags.find((t) => t.name === tagData.name)) {
      setShowoffData((prev) => ({ ...prev, tags: [...prev.tags, newTag] }))
    }
  }

  const removeTag = (tagName) => {
    setShowoffData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag.name !== tagName),
    }))
  }

  /* Added custom icon selection functionality */
  const updateTagIcon = (iconName, iconFamily) => {
    if (selectedTagForCustomization) {
      setShowoffData((prev) => ({
        ...prev,
        tags: prev.tags.map((tag) =>
          tag.name === selectedTagForCustomization.name ? { ...tag, iconName, iconFamily } : tag,
        ),
      }))
      setIsIconModalOpen(false)
      setSelectedTagForCustomization(null)
    }
  }

  /* Added custom color selection functionality */
  const updateTagColor = (color) => {
    if (selectedTagForCustomization) {
      setShowoffData((prev) => ({
        ...prev,
        tags: prev.tags.map((tag) => (tag.name === selectedTagForCustomization.name ? { ...tag, color } : tag)),
      }))
      setIsColorModalOpen(false)
      setSelectedTagForCustomization(null)
    }
  }

  const addDemoLink = (type) => {
    if (!showoffData.demo.find((d) => d.type === type)) {
      setShowoffData((prev) => ({
        ...prev,
        demo: [...prev.demo, { type, url: "" }],
      }))
    }
  }

  const updateDemoUrl = (type, url) => {
    setShowoffData((prev) => ({
      ...prev,
      demo: prev.demo.map((demo) => (demo.type === type ? { ...demo, url } : demo)),
    }))
  }

  const removeDemoLink = (type) => {
    setShowoffData((prev) => ({
      ...prev,
      demo: prev.demo.filter((demo) => demo.type !== type),
    }))
  }

  const getIconComponent = (iconName, iconFamily = 'ionicons') => {
    const iconData = ICON_LIBRARY.find((icon) => icon.name === iconName)
    if (iconData) {
      return iconData.component
    }
    
    // Fallback to Ionicons if icon not found
    switch (iconFamily) {
      case 'ionicons':
        return Ionicons
      case 'material':
        return MaterialIcons
      case 'fontawesome':
        return FontAwesome
      default:
        return Ionicons
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 animate-fade-in-up">
          
          
        </div>

        <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0 rounded-2xl overflow-hidden animate-scale-in">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Project Details */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-semibold font-sans text-gray-700 mb-2">
                      Project Title
                    </label>
                    <Input
                      id="title"
                      value={showoffData.title}
                      onChange={(e) => setShowoffData((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter your amazing project title"
                      className="w-full px-4 py-3 bg-input border-border rounded-xl focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-200 font-serif"
                    />
                  </div>

                  <div>
                    <label htmlFor="tagline" className="block text-sm font-semibold font-sans text-gray-700 mb-2">
                      Tagline
                    </label>
                    <Input
                      id="tagline"
                      value={showoffData.tagline}
                      onChange={(e) => setShowoffData((prev) => ({ ...prev, tagline: e.target.value }))}
                      placeholder="A compelling description of your project"
                      className="w-full px-4 py-3 bg-input border-border rounded-xl focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-200 font-serif"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold font-sans text-gray-700 mb-2">Cover Image</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center hover:border-indigo-500 transition-all duration-200 cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <Ionicons name="ios-cloud-upload" size={48} className="text-gray-500 mb-3" />
                    <p className="text-sm text-gray-500 font-serif">Drag and drop or click to upload</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold font-sans text-gray-700 mb-2">Description</label>
                  <Textarea
                    value={showoffData.description}
                    onChange={(e) => setShowoffData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Write your project description here (supports Markdown)"
                    className="w-full px-4 py-3 bg-input border-border rounded-xl h-32 focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-200 resize-none font-serif"
                  />
                </div>
              </div>

              {/* Right Column - Tags and Links */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold font-sans text-gray-700 mb-3">Project Tags</label>

                  <Button
                    onClick={() => setIsTagModalOpen(true)}
                    className="w-full mb-4 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-xl py-3 font-sans transition-all duration-200 hover:scale-[1.02]"
                  >
                    <Ionicons name="ios-add" size={16} style={{ marginRight: 8 }} />
                    Add Tags
                  </Button>

                  {/* Selected Tags Display */}
                  <div className="flex flex-wrap gap-3">
                    {showoffData.tags.map((tag) => {
                      const IconComponent = getIconComponent(tag.iconName, tag.iconFamily)
                      return (
                        <div
                          key={tag.name}
                          className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 bg-white hover:shadow-md hover:border-gray-400 transition-all duration-200 group"
                        >
                          <button
                            onClick={() => {
                              setSelectedTagForCustomization(tag)
                              setIsIconModalOpen(true)
                            }}
                            className="hover:scale-110 transition-transform duration-200"
                          >
                            <IconComponent name={tag.iconName} size={16} style={{ color: tag.color }} />
                          </button>
                          <span className="font-serif text-sm text-gray-700">{tag.name}</span>
                          <button
                            onClick={() => {
                              setSelectedTagForCustomization(tag)
                              setCustomColor(tag.color)
                              setIsColorModalOpen(true)
                            }}
                            className="hover:scale-110 transition-transform duration-200"
                          >
                            <Ionicons name="ios-palette" size={12} style={{ color: tag.color }} />
                          </button>
                          <button
                            onClick={() => removeTag(tag.name)}
                            className="hover:scale-110 transition-transform duration-200 opacity-0 group-hover:opacity-100"
                          >
                            <Ionicons name="ios-close" size={12} style={{ color: 'var(--destructive)' }} />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold font-sans text-gray-700 mb-3">Project Links</label>

                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium font-sans text-gray-600">Add Demo Links</h4>
                      <span className="text-xs text-gray-500 font-serif">
                        {showoffData.demo.length}/4 links added
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {demoTypes.map((demoType) => {
                        const IconComponent = demoType.icon
                        const hasDemo = showoffData.demo.find((d) => d.type === demoType.type)

                        return (
                          <button
                            key={demoType.type}
                            onClick={() => addDemoLink(demoType.type)}
                            disabled={!!hasDemo}
                            className={`group relative p-4 rounded-xl border-2 transition-all duration-300 ${
                              hasDemo
                                ? "bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30 shadow-lg shadow-primary/10"
                                : "bg-background/50 border-border hover:border-primary/50 hover:bg-gradient-to-br hover:from-primary/5 hover:to-primary/10 hover:shadow-md hover:scale-105"
                            }`}
                          >
                            <div className="flex flex-col items-center gap-2">
                              <div
                                className={`p-2 rounded-lg transition-all duration-200 ${
                                  hasDemo
                                    ? "bg-primary/20 text-primary"
                                    : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                                }`}
                              >
                                <IconComponent name={demoType.iconName} size={20} />
                              </div>
                              <span
                                className={`text-xs font-medium font-sans ${
                                  hasDemo ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                                }`}
                              >
                                {demoType.label}
                              </span>
                              {hasDemo && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background animate-pulse" />
                              )}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {showoffData.demo.map((demo) => {
                      const demoType = demoTypes.find((dt) => dt.type === demo.type)
                      if (!demoType) return null
                      const IconComponent = demoType.icon

                      return (
                        <div
                          key={demo.type}
                          className="group relative bg-gradient-to-r from-white to-gray-50 border border-gray-300 rounded-xl p-4 hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <div className={`p-3 ${demoType.color} rounded-xl shadow-sm`}>
                                <IconComponent name={demoType.iconName} size={20} />
                              </div>
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background" />
                            </div>

                            <div className="flex-1 space-y-1">
                              <label className="block text-sm font-medium font-sans text-gray-700">
                                {demoType.label} URL
                              </label>
                              <Input
                                type="url"
                                value={demo.url}
                                onChange={(e) => updateDemoUrl(demo.type, e.target.value)}
                                placeholder={`https://your-${demoType.type}-link.com`}
                                className="bg-background/80 border-border/50 rounded-lg font-serif text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200"
                              />
                            </div>

                            <button
                              onClick={() => removeDemoLink(demo.type)}
                              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                            >
                              <Ionicons name="ios-close" size={16} />
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-8 border-t border-border mt-8">
              <Button
                variant="outline"
                className="px-6 py-3 border-border rounded-xl hover:bg-muted transition-all duration-200 font-sans bg-transparent"
              >
                Save Draft
              </Button>
              <Button className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-all duration-200 hover:scale-[1.02] font-sans">
                Publish Showoff
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tag Selection Modal */}
        {isTagModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto animate-scale-in">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold font-sans text-gray-700">Select Tags</h2>
                  <button
                    onClick={() => setIsTagModalOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Ionicons name="ios-close" size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {Object.entries(TAG_CATEGORIES).map(([category, tags]) => (
                  <div key={category}>
                    <h3 className="text-lg font-semibold font-sans mb-3 text-gray-700">{category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => {
                        const isSelected = showoffData.tags.find((t) => t.name === tag.name)
                        const IconComponent = getIconComponent(tag.defaultIcon, tag.iconFamily)

                        return (
                                                  <button
                          key={tag.name}
                          onClick={() => addTag(tag, category.toLowerCase())}
                          disabled={!!isSelected}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 font-serif ${
                            isSelected
                              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                              : "bg-white border border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 hover:scale-105"
                          }`}
                        >
                          <IconComponent name={tag.defaultIcon} size={16} style={{ color: tag.defaultColor }} />
                          {tag.name}
                        </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Icon Selection Modal */}
        {isIconModalOpen && selectedTagForCustomization && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full animate-scale-in">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold font-sans text-gray-700">Choose Icon for {selectedTagForCustomization.name}</h2>
                  <button
                    onClick={() => {
                      setIsIconModalOpen(false)
                      setSelectedTagForCustomization(null)
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Ionicons name="ios-close" size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-6 gap-3">
                  {ICON_LIBRARY.map((icon) => {
                    const IconComponent = icon.component
                    return (
                      <button
                        key={icon.name}
                        onClick={() => updateTagIcon(icon.name, icon.family)}
                        className="p-4 border border-gray-300 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 hover:scale-105"
                      >
                        <IconComponent
                          name={icon.name}
                          size={24}
                          style={{ color: selectedTagForCustomization.color }}
                        />
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Color Selection Modal */}
        {isColorModalOpen && selectedTagForCustomization && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scale-in">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold font-sans text-gray-700">Choose Color for {selectedTagForCustomization.name}</h2>
                  <button
                    onClick={() => {
                      setIsColorModalOpen(false)
                      setSelectedTagForCustomization(null)
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Ionicons name="ios-close" size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-6 gap-2">
                  {COLOR_PALETTE.map((color) => (
                    <button
                      key={color}
                      onClick={() => updateTagColor(color)}
                      className="w-10 h-10 rounded-lg border-2 border-border hover:scale-110 transition-all duration-200"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold font-sans">Custom Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      className="w-12 h-10 rounded-lg border border-border cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      className="flex-1 font-mono text-sm"
                      placeholder="#374151"
                    />
                    <Button
                      onClick={() => updateTagColor(customColor)}
                      className="px-4 bg-secondary hover:bg-secondary/90"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


