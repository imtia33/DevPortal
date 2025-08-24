"use client"

import React from "react"
import { useState, useCallback, useMemo } from "react"
import { Platform, View, Text, ScrollView, TextInput, Pressable, Modal, KeyboardAvoidingView, TouchableOpacity, Alert, Image } from "react-native"
import { Ionicons, MaterialCommunityIcons, FontAwesome6 } from "@expo/vector-icons"
import { useTheme } from "../../../context/ColorMode"
import IconPicker from "../../../componants/IconPicker"
import { useAppwriteContext } from "../../../context/appwriteContext"
import { createShowoff ,getAvatar, deleteCoverImage} from "../../../backend/appwrite"
import * as ImagePicker from 'expo-image-picker'
import { uploadCoverImage } from '../../../backend/appwrite'
import TagPicker from "../../../componants/TagPicker"
import ColorPicker from "../../../componants/ColorPicker"




const Button = ({ children, onClick, disabled, variant = "default", className = "", ...props }) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background"
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} px-4 py-2 ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

const Input = ({ className = "", ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
)

const Textarea = ({ className = "", ...props }) => (
  <textarea
    className={`flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
)


// Theme-aware color palette (aligned with profile screen)
const useThemedColors = (mode) =>
  mode === "dark"
    ? {
        background: "rgb(6, 10, 17)",
        foreground: "#f1f5f9",
        card: "rgb(7, 12, 21)",
        cardForeground: "#f1f5f9",
        primary: "#15803d",
        primaryForeground: "#fef2f2",
        secondary: "#1e293b",
        secondaryForeground: "#f1f5f9",
        muted: "#1e293b",
        mutedForeground: "#94a3b8",
        accent: "#1e293b",
        accentForeground: "#f1f5f9",
        destructive: "#7f1d1d",
        destructiveForeground: "#f1f5f9",
        border: "#1e293b",
        input: "#1e293b",
        ring: "#15803d",
      }
    : {
        background: "rgb(236, 244, 240)",
        foreground: "#0f172a",
        card: "#fff",
        cardForeground: "#0f172a",
        primary: "#22c55e",
        primaryForeground: "#052e16",
        secondary: "#f1f5f9",
        secondaryForeground: "#0f172a",
        muted: "#f1f5f9",
        mutedForeground: "#64748b",
        accent: "#f1f5f9",
        accentForeground: "#0f172a",
        destructive: "#ef4444",
        destructiveForeground: "#f1f5f9",
        border: "#e2e8f0",
        input: "#e2e8f0",
        ring: "#22c55e",
      }


const TAG_CATEGORIES = {
  Platforms: [
    { name: "Apple", defaultIcon: "logo-apple", iconFamily: "ionicons", defaultColor: "#374151" },
    { name: "Android", defaultIcon: "logo-android", iconFamily: "ionicons", defaultColor: "#22c55e" },
    { name: "Web", defaultIcon: "earth", iconFamily: "ionicons", defaultColor: "#3b82f6" },
    { name: "Windows", defaultIcon: "logo-windows", iconFamily: "ionicons", defaultColor: "#0ea5e9" },
    { name: "Linux", defaultIcon: "logo-tux", iconFamily: "ionicons", defaultColor: "#f59e0b" },
    { name: "macOS", defaultIcon: "logo-apple", iconFamily: "ionicons", defaultColor: "#6b7280" },
    { name: "iOS", defaultIcon: "logo-apple", iconFamily: "ionicons", defaultColor: "#374151" },
  ],
  Languages: [
    { name: "JavaScript", defaultIcon: "logo-javascript", iconFamily: "ionicons", defaultColor: "#F7DF1E" }, // JS yellow
    { name: "TypeScript", defaultIcon: "language-typescript", iconFamily: "materialCommunity", defaultColor: "#3178C6" }, // TS blue
    { name: "Python", defaultIcon: "language-python", iconFamily: "materialCommunity", defaultColor: "#3776AB" }, // Python blue
    { name: "C++", defaultIcon: "language-cpp", iconFamily: "materialCommunity", defaultColor: "#00599C" }, // ISO C++ blue
    { name: "Java", defaultIcon: "language-java", iconFamily: "materialCommunity", defaultColor: "#E76F00" }, // Java orange
    { name: "Ruby", defaultIcon: "language-ruby", iconFamily: "materialCommunity", defaultColor: "#CC342D" }, // Ruby red
    { name: "Go", defaultIcon: "language-go", iconFamily: "materialCommunity", defaultColor: "#00ADD8" }, // Go cyan
    { name: "PHP", defaultIcon: "language-php", iconFamily: "materialCommunity", defaultColor: "#777BB4" }, // PHP purple
    { name: "Swift", defaultIcon: "language-swift", iconFamily: "materialCommunity", defaultColor: "#F05138" }, // Swift orange
    { name: "Kotlin", defaultIcon: "language-kotlin", iconFamily: "materialCommunity", defaultColor: "#A97BFF" }, // Kotlin purple
    { name: "Rust", defaultIcon: "language-rust", iconFamily: "materialCommunity", defaultColor: "#DEA584" }, // Rust brownish
    { name: "Dart", defaultIcon: "dart-lang", iconFamily: "fontawesome6", defaultColor: "#0175C2" }, // Dart blue
    { name: "C#", defaultIcon: "language-csharp", iconFamily: "materialCommunity", defaultColor: "#239120" }, // C# green
  ],
  Frameworks: [
    { name: "React", defaultIcon: "react", iconFamily: "fontawesome6", defaultColor: "#06b6d4" },
    { name: "Angular", defaultIcon: "angular", iconFamily: "fontawesome6", defaultColor: "#dc2626" },
    { name: "Vue", defaultIcon: "vuejs", iconFamily: "fontawesome6", defaultColor: "#22c55e" },
    { name: "Next.js", defaultIcon: "alpha-n-box-outline", iconFamily: "materialCommunity", defaultColor: "#374151" },
    { name: "Flutter", defaultIcon: "flutter", iconFamily: "fontawesome6", defaultColor: "#3b82f6" },
    { name: "Express", defaultIcon: "alpha-e-circle-outline", iconFamily: "materialCommunity", defaultColor: "#374151" },
    { name: "Nuxt", defaultIcon: "nuxt", iconFamily: "materialCommunity", defaultColor: "#ef4444" },
    { name: "React Native", defaultIcon: "react", iconFamily: "materialCommunity", defaultColor: "#ef4444" },
  ],  
  Databases: [
    { name: "MongoDB", defaultIcon: "database", iconFamily: "materialCommunity", defaultColor: "#22c55e" }, // green
    { name: "MySQL", defaultIcon: "dolphin", iconFamily: "materialCommunity", defaultColor: "#00758f" }, // MySQL blue
    { name: "Firebase", defaultIcon: "firebase", iconFamily: "materialCommunity", defaultColor: "#f59e0b" }, // orange/yellow
    { name: "Supabase", defaultIcon: "bolt", iconFamily: "fontawesome6", defaultColor: "#3b82f6" }, // blue
  ],  
  Tools: [
    { name: "Docker", defaultIcon: "logo-docker", iconFamily: "ionicons", defaultColor: "#2496ed" }, // Docker blue
    { name: "Kubernetes", defaultIcon: "kubernetes", iconFamily: "materialCommunity", defaultColor: "#326ce5" }, // Kubernetes blue
    { name: "Git", defaultIcon: "git-branch", iconFamily: "ionicons", defaultColor: "#f05032" }, // Git red-orange
    { name: "Webpack", defaultIcon: "webpack", iconFamily: "materialCommunity", defaultColor: "#8ed6fb" }, // Webpack light blue
    { name: "Vite", defaultIcon: "vuetify", iconFamily: "materialCommunity", defaultColor: "#646cff" }, // Vite purple
    { name: "Figma", defaultIcon: "logo-figma", iconFamily: "ionicons", defaultColor: "#f24e1e" }, // Figma red
  ]
  
}


const demoTypes = [
  { type: "web", label: "Website", icon: Ionicons, iconName: "earth", color: "bg-blue-100 text-blue-700 hover:bg-blue-200" },
  { type: "github", label: "GitHub", icon: Ionicons, iconName: "logo-github", color: "bg-gray-100 text-gray-700 hover:bg-gray-200" },
  { type: "googleplay", label: "Google Play", icon: Ionicons, iconName: "logo-android", color: "bg-green-100 text-green-700 hover:bg-green-200" },
  { type: "applestore", label: "App Store", icon: Ionicons, iconName: "logo-apple-appstore", color: "bg-gray-100 text-gray-700 hover:bg-gray-200" },
]



const getExpoIconComponent = (family) => {
  switch (family) {
    case "ionicons":
      return Ionicons
    case "materialCommunity":
      return MaterialCommunityIcons
    case "fontawesome6":
      return FontAwesome6
    default:
      return Ionicons
  }
}


export default function ShowoffMaker() {
  const { theme } = useTheme()
  const colors = useThemedColors(theme?.mode || "light")
  const cardShadow = "0 4px 24px 0 rgba(0,0,0,0.10), 0 1.5px 6px 0 rgba(0,0,0,0.08)"
  
  // Add CSS for web animations
  React.useEffect(() => {
    if (Platform.OS === 'web') {
      const style = document.createElement('style')
      style.textContent = `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `
      document.head.appendChild(style)
      return () => document.head.removeChild(style)
    }
  }, [])
  
  const [showoffData, setShowoffData] = useState({
    title: "",
    tagline: "",
    coverImageUrl: "",
    tags: [],
    description: "",
    demo: [],
    image:null
  })
  const [image,setImage]=useState(null)
  const {user,gitUserInfo}=useAppwriteContext()
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [localCoverUri, setLocalCoverUri] = useState("")

  // Clean up web object URLs when component unmounts or image changes
  const cleanupImage = useCallback(() => {
    if (Platform.OS === 'web' && localCoverUri && localCoverUri.startsWith('blob:')) {
      URL.revokeObjectURL(localCoverUri)
    }
  }, [localCoverUri])

  // Clean up on unmount
  React.useEffect(() => {
    return () => {
      cleanupImage()
    }
  }, [cleanupImage])

  const removeImage = () => {
    // If image was uploaded to cloud, ask for confirmation
    if (showoffData.coverImageUrl && !localCoverUri) {
      showError(
        "Remove Image", 
        "This image has already been uploaded. Are you sure you want to remove it?",
        [
          { text: "Cancel", onPress: hideError },
          { 
            text: "Remove", 
            onPress: () => {
              hideError()
              cleanupImage()
              setImage(null)
              setLocalCoverUri("")
              setShowoffData((prev) => ({ ...prev, coverImageUrl: "" }))
            }
          }
        ]
      )
    } else {
      // Local image or no image, just remove
      cleanupImage()
      setImage(null)
      setLocalCoverUri("")
      setShowoffData((prev) => ({ ...prev, coverImageUrl: "" }))
    }
  }

  const submitShowoff=async()=>{
    if(showoffData.tags.length===0){
      showError("Validation Error", "Please select at least one tag")
      return
    }
    if(showoffData.title===""){
      showError("Validation Error", "Please enter a title")
      return
    }
    if(showoffData.tagline===""){
      showError("Validation Error", "Please enter a tagline")
      return
    }
    if(showoffData.description===""){
      showError("Validation Error", "Please enter a description")
      return
    }
    if(showoffData.demo.length===0){
      showError("Validation Error", "Please enter at least one demo link")
      return
    }
    if(uploadingImage){
      showError("Upload in Progress", "Please wait for image upload to complete")
      return
    }
    
    setLoading(true)
    let uploadedImageData = null
    
    try {
      // Step 1: Upload image if exists
      if (image) {
        setUploadingImage(true)
        showLoading("Uploading Image", "Please wait while we upload your cover image...")
        
        try {
          uploadedImageData = await uploadCoverImage(image, user?.$id)
          hideLoading()
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError)
          hideLoading()
          setUploadingImage(false)
          setLoading(false)
          showError('Upload Failed', 'Failed to upload image. Please try again or use a different image.', [
            { text: "OK", onPress: hideError },
            { 
              text: "Retry Upload", 
              onPress: () => {
                hideError()
                // Retry the upload
                submitShowoff()
              }
            }
          ])
          return
        }
        setUploadingImage(false)
      }
      
      // Step 2: Create showoff
      showLoading("Creating Showoff", "Please wait while we create your project showcase...")
      
      const doc = {
        title: showoffData.title,
        tagline: showoffData.tagline,
        description: showoffData.description,
        tags: JSON.stringify(showoffData.tags),
        demo: JSON.stringify(showoffData.demo),
        coverImageUrl: uploadedImageData?.url || "",
        userId: user?.id,
        username: user?.name || gitUserInfo?.name,
        avatarUrl: gitUserInfo?.avatar_url || (user?.name ? await getAvatar(user?.name) : undefined),
      }
      
      const result = await createShowoff(doc)
      console.log('Showoff creation result:', result)
      hideLoading()
      
      // Parse the result - Appwrite functions return execution result with responseBody
      let responseData
      try {
        if (result && result.responseBody) {
          // Extract responseBody from execution result
          responseData = JSON.parse(result.responseBody)
        } else if (typeof result === 'string') {
          // Fallback: try to parse as string
          responseData = JSON.parse(result)
        } else {
          // Fallback: use result directly
          responseData = result
        }
      } catch (e) {
        console.error('Failed to parse result:', e)
        responseData = result
      }
      
      if (responseData?.type === 'success') {
        // Success - show success message and reset form
        showLoading("Success!", "Your showoff has been created successfully!")
        setTimeout(() => {
          hideLoading()
          setShowoffData({
            title: "",
            tagline: "",
            coverImageUrl: "",
            tags: [],
            description: "",
            demo: [],
          })
          removeImage()
        }, 1500)
      } else if (responseData?.type === 'fail') {
        // Handle specific failure cases
        const errorMessage = responseData?.error || "Failed to create showoff"
        
        // Delete uploaded image on any failure to save storage
        if (uploadedImageData?.fileId) {
          try {
            await deleteCoverImage(uploadedImageData.fileId, user?.$id)
          } catch (deleteError) {
            console.error('Failed to delete image:', deleteError)
          }
        }
        
        if (errorMessage.includes('maximum amount of showcases')) {
          // User hit the limit - show error
          showError(
            "Limit Reached", 
            "You have reached the maximum amount of showcases allowed (10). Please delete some showcases to create new ones.",
            [
              { text: "OK", onPress: hideError },
              { 
                text: "View My Showcases", 
                onPress: () => {
                  hideError()
                  // Navigate to user's showcases (you can implement this navigation)
                  console.log('Navigate to user showcases')
                }
              }
            ]
          )
        } else {
          // Other validation errors
          showError("Creation Failed", errorMessage)
        }
      } else {
        // Unexpected response - delete uploaded image
        if (uploadedImageData?.fileId) {
          try {
            await deleteCoverImage(uploadedImageData.fileId, user?.$id)
          } catch (deleteError) {
            console.error('Failed to delete image:', deleteError)
          }
        }
        showError("Server Error", "Unexpected response from server. Please try again.")
      }
    } catch (e) {
      console.error('Error in submitShowoff:', e)
      hideLoading()
      
      // Delete uploaded image for any error to save storage
      if (uploadedImageData?.fileId) {
        try {
          await deleteCoverImage(uploadedImageData.fileId, user?.$id)
        } catch (deleteError) {
          console.error('Failed to delete image:', deleteError)
        }
      }
      
      showError("Error", e.message || "Failed to create showoff. Please try again.")
    }
    
    setLoading(false)
  }


  const [isTagModalOpen, setIsTagModalOpen] = useState(false)
  const [isIconModalOpen, setIsIconModalOpen] = useState(false)
  const [isColorModalOpen, setIsColorModalOpen] = useState(false)
  const [selectedTagForCustomization, setSelectedTagForCustomization] = useState(null)
  const [customColor, setCustomColor] = useState("#374151")
  
  // Loading and status modals
  const [showLoadingModal, setShowLoadingModal] = useState(false)
  const [loadingModalTitle, setLoadingModalTitle] = useState("")
  const [loadingModalMessage, setLoadingModalMessage] = useState("")
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorModalTitle, setErrorModalTitle] = useState("")
  const [errorModalMessage, setErrorModalMessage] = useState("")
  const [errorModalActions, setErrorModalActions] = useState([])

  const selectedTagsSet = useMemo(() => new Set(showoffData.tags.map((t) => t.name)), [showoffData.tags])

  const demoTypesMap = useMemo(() => new Map(showoffData.demo.map((d) => [d.type, d])), [showoffData.demo])

  // Helper functions for modals
  const showLoading = (title, message) => {
    setLoadingModalTitle(title)
    setLoadingModalMessage(message)
    setShowLoadingModal(true)
  }

  const hideLoading = () => {
    setShowLoadingModal(false)
  }

  const showError = (title, message, actions = []) => {
    setErrorModalTitle(title)
    setErrorModalMessage(message)
    setErrorModalActions(actions)
    setShowErrorModal(true)
  }

  const hideError = () => {
    setShowErrorModal(false)
  }

  const addTag = (tagData, category) => {
    const newTag = {
      name: tagData.name,
      iconName: tagData.defaultIcon,
      iconFamily: tagData.iconFamily,
      color: tagData.defaultColor,
    }

    setShowoffData((prev) => {
      const alreadySelected = prev.tags.some((t) => t.name === tagData.name)
      if (alreadySelected) return prev
      if (prev.tags.length >= 10) return prev
      return { ...prev, tags: [...prev.tags, newTag] }
    })
  }

  const removeTag = (tagName) => {
    setShowoffData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag.name !== tagName),
    }))
  }

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
    if (!demoTypesMap.has(type)) {
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



  const handleTagIconClick = useCallback((tag) => {
    setSelectedTagForCustomization(tag)
    setIsIconModalOpen(true)
  }, [])

  const handleTagColorClick = useCallback((tag) => {
    setSelectedTagForCustomization(tag)
    setCustomColor(tag.color)
    setIsColorModalOpen(true)
  }, [])

  const handleDemoUrlChange = useCallback((type, url) => {
    updateDemoUrl(type, url)
  }, [])

  const pickCoverImage = async () => {
    // Clean up previous image if exists
    if (localCoverUri) {
      cleanupImage()
    }
    
    if (Platform.OS === 'web') {
      // Web: Create a file input
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.onchange = (e) => {
        const file = e.target.files[0]
        if (file) {
          // Check file size (4MB limit)
          const maxSize = 4 * 1024 * 1024 // 4MB in bytes
          if (file.size > maxSize) {
            showError(
              "File Too Large", 
              "Image size must be less than 4MB. Please choose a smaller image or compress it.",
              [{ text: "OK", onPress: hideError }]
            )
            return
          }
          
          // Convert file to asset-like object for consistency
          const asset = {
            uri: URL.createObjectURL(file),
            fileName: file.name,
            mimeType: file.type,
            fileSize: file.size,
            // For web, we'll store the file object for upload
            file: file
          }
          setImage(asset)
          setLocalCoverUri(asset.uri)
        }
      }
      input.click()
    } else {
      // Mobile: Use Expo Image Picker
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      })
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0]
        
        // Check file size (4MB limit)
        const maxSize = 4 * 1024 * 1024 // 4MB in bytes
        if (asset.fileSize && asset.fileSize > maxSize) {
          showError(
            "File Too Large", 
            "Image size must be less than 4MB. Please choose a smaller image or compress it.",
            [{ text: "OK", onPress: hideError }]
          )
          return
        }
        
        setImage(asset)
        setLocalCoverUri(asset.uri)
      }
    }
  }

  // Native render for iOS/Android (keeps web layout intact)
 

    
    const chipStyle = {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.muted,
      marginRight: 8,
      marginBottom: 8,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    }

    const extraDemoLinks = showoffData.demo.length > 2 ? (showoffData.demo.length - 2) * 80 : 0
    const scrollPaddingBottom = 96 + extraDemoLinks

    // Native image uploader UI
    const renderCoverUploader = () => (
      <View style={{ marginBottom: 16 }}>
        <Text style={{ color: colors.foreground, fontWeight: "600", marginBottom: 6 }}>Cover Image</Text>
        <Pressable
          onPress={pickCoverImage}
          style={{
            borderWidth: 2,
            borderStyle: "dashed",
            borderColor: colors.border,
            backgroundColor: colors.muted + "50",
            borderRadius: 16,
            padding: 20,
            alignItems: "center",
            justifyContent: "center",
            minHeight: 120,
            position: "relative",
          }}
          disabled={uploadingImage}
        >
          {localCoverUri || showoffData.coverImageUrl ? (
            <View style={{ width: "100%", alignItems: "center", position: "relative" }}>
              <View style={{ position: "relative" }}>
                <Image
                  source={{ uri: localCoverUri || showoffData.coverImageUrl }}
                  style={{ width: 240, height: 120, borderRadius: 12, marginBottom: 8, resizeMode: "cover" }}
                />
                <Pressable
                  onPress={removeImage}
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    backgroundColor: colors.card,
                    borderRadius: 999,
                    padding: 4,
                    zIndex: 2,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                >
                  <Ionicons name="close" size={16} color={colors.destructive} />
                </Pressable>
              </View>
              <Text style={{ color: colors.mutedForeground, fontSize: 12, marginTop: 2 }}>
                {uploadingImage ? "Uploading..." : "Tap to change image"}
              </Text>
              {uploadingImage && (
                <View style={{ 
                  marginTop: 8, 
                  width: 200, 
                  height: 4, 
                  backgroundColor: colors.border, 
                  borderRadius: 2,
                  overflow: 'hidden'
                }}>
                  <View style={{ 
                    width: '100%', 
                    height: '100%', 
                    backgroundColor: colors.primary,
                    borderRadius: 2,
                    ...(Platform.OS === 'web' && { 
                      animation: 'progress 2s ease-in-out infinite',
                      transform: 'translateX(-100%)'
                    })
                  }} />
                </View>
              )}
            </View>
          ) : (
            <>
              <Ionicons name="cloud-upload" size={40} color={colors.mutedForeground} style={{ marginBottom: 8 }} />
              <Text style={{ color: colors.mutedForeground, fontSize: 14, marginBottom: 2 }}>
                {uploadingImage ? "Uploading..." : "Tap to upload cover image"}
              </Text>
              <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>PNG, JPG up to 4MB</Text>
              {uploadingImage && (
                <View style={{ 
                  marginTop: 12, 
                  width: 200, 
                  height: 4, 
                  backgroundColor: colors.border, 
                  borderRadius: 2,
                  overflow: 'hidden'
                }}>
                  <View style={{ 
                    width: '100%', 
                    height: '100%', 
                    backgroundColor: colors.primary,
                    borderRadius: 2,
                    // Add progress animation for web
                    ...(Platform.OS === 'web' && { 
                      animation: 'progress 2s ease-in-out infinite',
                      transform: 'translateX(-100%)'
                    })
                  }} />
                </View>
              )}
            </>
          )}
        </Pressable>
      </View>
    )

    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
            padding: 0,
            minHeight: '100%',
            paddingBottom: scrollPaddingBottom + 80,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ maxWidth: 1200, width: '100%', alignSelf: 'center', padding: 16 }}>
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 28, fontWeight: '700', marginBottom: 6, color: colors.foreground, textAlign: 'center' }}>
                Create Your Project Showoff
              </Text>
              <Text style={{ fontSize: 16, color: colors.mutedForeground, textAlign: 'center' }}>
                Showcase your amazing projects with style
              </Text>
            </View>

            {/* Responsive grid: column on mobile, row on large screens */}
            <View
              style={{
                flexDirection: 'column',
                gap: 24,
                width: '100%',
              }}
            >
              <View
                style={{
                  flexDirection: 'column',
                  gap: 24,
                  width: '100%',
                }}
              >
                {/* Responsive: row on large screens */}
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 24,
                    width: '100%',
                  }}
                >
                  {/* Left column: Project Details */}
                  <View
                    style={{
                      flex: 1,
                      minWidth: 320,
                      maxWidth: 600,
                      backgroundColor: colors.card,
                      borderRadius: 20,
                      borderWidth: 1,
                      borderColor: colors.border,
                      boxShadow: cardShadow,
                      padding: 20,
                      marginBottom: 24,
                    }}
                  >
                    <View style={{ gap: 16 }}>
                  <View>
                        <Text style={{ color: colors.foreground, fontWeight: '600', marginBottom: 6 }}>Project Title</Text>
                    <TextInput
                      value={showoffData.title}
                      onChangeText={(t) => setShowoffData((p) => ({ ...p, title: t }))}
                      placeholder="Enter your amazing project title"
                      placeholderTextColor={colors.mutedForeground}
                      style={{ height: 44, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.input, color: colors.foreground, borderRadius: 12, paddingHorizontal: 12 }}
                    />
                  </View>
                  <View>
                        <Text style={{ color: colors.foreground, fontWeight: '600', marginBottom: 6 }}>Tagline</Text>
                    <TextInput
                      value={showoffData.tagline}
                      onChangeText={(t) => setShowoffData((p) => ({ ...p, tagline: t }))}
                      placeholder="One-liner that hooks your audience"
                      placeholderTextColor={colors.mutedForeground}
                      style={{ height: 44, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.input, color: colors.foreground, borderRadius: 12, paddingHorizontal: 12 }}
                    />
                  </View>
                  {renderCoverUploader()}
                  <View>
                        <Text style={{ color: colors.foreground, fontWeight: '600', marginBottom: 6 }}>Description</Text>
                    <TextInput
                      value={showoffData.description}
                      onChangeText={(t) => setShowoffData((p) => ({ ...p, description: t }))}
                      placeholder="Tell the world about your amazing project..."
                      placeholderTextColor={colors.mutedForeground}
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                      style={{ minHeight: 96, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.input, color: colors.foreground, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 }}
                    />
                  </View>
                </View>
              </View>

                  {/* Right column: Tags and Demo Links */}
                  <View
                    style={{
                      flex: 1,
                      minWidth: 320,
                      maxWidth: 600,
                      gap: 24,
                    }}
                  >
                    {/* Tags Card */}
                    <View style={{ borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, borderRadius: 20, padding: 16, marginBottom: 24, boxShadow: cardShadow }}>
                      <Text style={{ color: colors.foreground, fontWeight: '600', marginBottom: 10 }}>Project Tags</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <Pressable onPress={() => setIsTagModalOpen(true)} style={{ height: 40, width: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.secondary, borderWidth: 1, borderColor: colors.secondary + '30' }}>
                    <Ionicons name="pricetags" size={18} color={colors.secondaryForeground} />
                  </Pressable>
                  <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>{Math.min(selectedTagsSet.size, 10)}/10 selected</Text>
                </View>
                {showoffData.tags.length > 0 && (
                        <View style={{ backgroundColor: colors.muted, borderWidth: 1, borderColor: colors.border + '50', borderRadius: 20, padding: 12 }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                            <Text style={{ color: colors.foreground, fontWeight: '600' }}>Selected Tags</Text>
                            <Text style={{ color: colors.secondary, fontSize: 12, backgroundColor: colors.secondary + '20', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 }}>{selectedTagsSet.size} tags</Text>
                    </View>
                          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                      {showoffData.tags.map((tag) => {
                        const TagIconComponent = getExpoIconComponent(tag.iconFamily)
                        return (
                          <View key={tag.name} style={[chipStyle, { borderColor: tag.color + '30', backgroundColor: colors.background }]}> 
                            <Pressable onPress={() => handleTagIconClick(tag)} style={{ padding: 4, borderRadius: 999 }}>
                              <TagIconComponent name={tag.iconName} size={24} color={tag.color} />
                            </Pressable>
                            <Text style={{ color: colors.foreground, fontSize: 14 }}>{tag.name}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <Pressable onPress={() => handleTagColorClick(tag)} style={{ padding: 4, borderRadius: 999 }}>
                                <Ionicons name="color-palette" size={16} color={tag.color} />
                              </Pressable>
                              <Pressable onPress={() => removeTag(tag.name)} style={{ padding: 4, borderRadius: 999 }}>
                                <Ionicons name="close" size={14} color={colors.destructive} />
                              </Pressable>
                            </View>
                          </View>
                        )
                      })}
                    </View>
                  </View>
                )}
              </View>

                    {/* Demo Links Card */}
                    <View style={{ borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, borderRadius: 20, padding: 16, boxShadow: cardShadow }}>
                      <Text style={{ color: colors.foreground, fontWeight: '600', marginBottom: 10 }}>Project Links</Text>
                      <View style={{ backgroundColor: colors.muted, borderWidth: 1, borderColor: colors.border + '50', borderRadius: 20, padding: 12, marginBottom: 12 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                          <Text style={{ color: colors.foreground + '80' }}>Add Demo Links</Text>
                    <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>{demoTypesMap.size}/4 links added</Text>
                  </View>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                    {demoTypes.map((demoType) => {
                      const hasDemo = demoTypesMap.has(demoType.type)
                      return (
                              <Pressable key={demoType.type} onPress={() => addDemoLink(demoType.type)} disabled={hasDemo} style={{ height: 112, width: '47%', alignItems: 'center', justifyContent: 'center', backgroundColor: hasDemo ? colors.muted : colors.card, borderWidth: 2, borderColor: hasDemo ? colors.border : colors.primary + '40', borderRadius: 16, opacity: hasDemo ? 0.5 : 1 }}>
                                <View style={{ width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: hasDemo ? colors.primary + '20' : colors.muted, marginBottom: 6 }}>
                            <Ionicons name={demoType.iconName} size={20} color={hasDemo ? colors.primary : colors.mutedForeground} />
                          </View>
                          <Text style={{ color: hasDemo ? colors.primary : colors.mutedForeground, fontSize: 12 }}>{demoType.label}</Text>
                        </Pressable>
                      )
                    })}
                  </View>
                </View>
                <View style={{ gap: 8 }}>
                  {showoffData.demo.map((demo) => {
                    const demoType = demoTypes.find((dt) => dt.type === demo.type)
                    if (!demoType) return null
                    return (
                      <View key={demo.type} style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 12, backgroundColor: colors.background }}>
                              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                <View style={{ width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.secondary, borderWidth: 1, borderColor: colors.border }}>
                                  <Ionicons name={demoType.iconName} size={20} color={theme?.mode === 'dark' ? '#fff' : '#000'} />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={{ color: colors.foreground, marginBottom: 4 }}>{demoType.label} URL</Text>
                            <TextInput
                              value={demo.url}
                              onChangeText={(t) => updateDemoUrl(demo.type, t)}
                              placeholder={`https://your-${demoType.type}-link.com`}
                              placeholderTextColor={colors.mutedForeground}
                              style={{ height: 40, borderWidth: 1, borderColor: colors.ring, backgroundColor: colors.input, color: colors.foreground, borderRadius: 10, paddingHorizontal: 10 }}
                            />
                          </View>
                          <Pressable onPress={() => removeDemoLink(demo.type)} style={{ padding: 8, borderRadius: 8, backgroundColor: colors.muted }}>
                            <Ionicons name="close" size={16} color={colors.destructive} />
                          </Pressable>
                        </View>
                      </View>
                    )
                  })}
                </View>
                    </View>
                  </View>
                </View>
              </View>

              {/* TagPicker and Modals remain unchanged */}
              <TagPicker
                visible={isTagModalOpen}
                onClose={() => setIsTagModalOpen(false)}
                selectedTags={showoffData.tags}
                onAddTag={addTag}
                onRemoveTag={removeTag}
                onClearAll={() => setShowoffData((prev) => ({ ...prev, tags: [] }))}
                tagCategories={TAG_CATEGORIES}
                maxTags={10}
              />
            {/* Icon Picker Modal - Native */}
            <Modal visible={isIconModalOpen && !!selectedTagForCustomization} transparent animationType="fade" onRequestClose={() => { setIsIconModalOpen(false); setSelectedTagForCustomization(null) }}>
              <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", alignItems: "center", justifyContent: "center", padding: 12 }}>
                <Pressable onPress={() => { setIsIconModalOpen(false); setSelectedTagForCustomization(null) }} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
                <View style={{ width: '100%', maxWidth: 900, height: '85%', backgroundColor: colors.card, borderRadius: 18, overflow: 'hidden' }}>
                  <View style={{ padding: 16, borderBottomWidth: 1, borderColor: colors.border }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={{ color: colors.foreground, fontWeight: '700', fontSize: 18 }}>Choose Icon for {selectedTagForCustomization?.name}</Text>
                      <Pressable onPress={() => { setIsIconModalOpen(false); setSelectedTagForCustomization(null) }} hitSlop={8} style={{ padding: 8, borderRadius: 10, borderWidth: 1, borderColor: colors.border }}>
                        <Ionicons name="close" size={18} color={colors.foreground} />
                      </Pressable>
                    </View>
                  </View>
                  <View style={{ padding: 12, flex: 1 }}>
                    <IconPicker
                      onSelectIcon={(iconName, iconFamily) => updateTagIcon(iconName, iconFamily)}
                      selectedFamily={selectedTagForCustomization?.iconFamily}
                      selectedIcon={selectedTagForCustomization?.iconName}
                      color={selectedTagForCustomization?.color}
                    />
                  </View>
                </View>
              </View>
            </Modal>

            {/* Color Picker Modal - Native */}
            <Modal visible={isColorModalOpen && !!selectedTagForCustomization} transparent animationType="fade" onRequestClose={() => { setIsColorModalOpen(false); setSelectedTagForCustomization(null) }}>
              <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", alignItems: "center", justifyContent: "center", padding: 12 }}>
                <Pressable onPress={() => { setIsColorModalOpen(false); setSelectedTagForCustomization(null) }} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
                <View style={{ width: '100%', maxWidth: 500, backgroundColor: colors.card, borderRadius: 18, overflow: 'hidden', maxHeight: '85%' }}>
                  <View style={{ padding: 16, borderBottomWidth: 1, borderColor: colors.border }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={{ color: colors.foreground, fontWeight: '700', fontSize: 18 }}>Choose Color for {selectedTagForCustomization?.name}</Text>
                      <Pressable onPress={() => { setIsColorModalOpen(false); setSelectedTagForCustomization(null) }} hitSlop={8} style={{ padding: 8, borderRadius: 10, borderWidth: 1, borderColor: colors.border }}>
                        <Ionicons name="close" size={18} color={colors.foreground} />
                      </Pressable>
                    </View>
                  </View>
                  <ScrollView style={{ padding: 16 }} showsVerticalScrollIndicator={false}>
                    <ColorPicker
                      initialColor={customColor}
                      onColorChange={(color) => setCustomColor(color)}
                      size={240}
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, gap: 12 }}>
                      <Pressable 
                        onPress={() => {
                          setIsColorModalOpen(false);
                          setSelectedTagForCustomization(null);
                        }}
                        style={{ 
                          flex: 1,
                          paddingHorizontal: 16, 
                          paddingVertical: 12, 
                          backgroundColor: 'transparent',
                          borderWidth: 1,
                          borderColor: colors.border,
                          borderRadius: 10 
                        }}
                      >
                        <Text style={{ color: colors.foreground, fontWeight: '600', textAlign: 'center' }}>Cancel</Text>
                      </Pressable>
                      <Pressable 
                        onPress={() => updateTagColor(customColor)} 
                        style={{ 
                          flex: 1,
                          paddingHorizontal: 16, 
                          paddingVertical: 12, 
                          backgroundColor: colors.primary, 
                          borderRadius: 10 
                        }}
                      >
                        <Text style={{ color: colors.primaryForeground, fontWeight: '600', textAlign: 'center' }}>Apply Color</Text>
                      </Pressable>
                    </View>
                  </ScrollView>
                </View>
              </View>
            </Modal>
            </View>
          </View>
        </ScrollView>
        
        {/* Loading Modal */}
        <Modal visible={showLoadingModal} transparent animationType="fade">
          <View style={{ 
            flex: 1, 
            backgroundColor: "rgba(0,0,0,0.7)", 
            alignItems: "center", 
            justifyContent: "center", 
            padding: 20 
          }}>
            <View style={{ 
              backgroundColor: colors.card, 
              borderRadius: 20, 
              padding: 32, 
              alignItems: "center", 
              maxWidth: 400,
              width: '100%',
              borderWidth: 1,
              borderColor: colors.border,
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
            }}>
              <View style={{ 
                width: 60, 
                height: 60, 
                borderRadius: 30, 
                borderWidth: 3, 
                borderColor: colors.primary + '30',
                borderTopColor: colors.primary,
                marginBottom: 20,
                // Add rotation animation for web
                ...(Platform.OS === 'web' && { animation: 'spin 1s linear infinite' })
              }} />
              <Text style={{ 
                color: colors.foreground, 
                fontSize: 20, 
                fontWeight: '700', 
                marginBottom: 8,
                textAlign: 'center'
              }}>
                {loadingModalTitle}
              </Text>
              <Text style={{ 
                color: colors.mutedForeground, 
                fontSize: 16, 
                textAlign: 'center',
                lineHeight: 22
              }}>
                {loadingModalMessage}
              </Text>
            </View>
          </View>
        </Modal>

        {/* Error Modal */}
        <Modal visible={showErrorModal} transparent animationType="fade">
          <View style={{ 
            flex: 1, 
            backgroundColor: "rgba(0,0,0,0.7)", 
            alignItems: "center", 
            justifyContent: "center", 
            padding: 20 
          }}>
            <View style={{ 
              backgroundColor: colors.card, 
              borderRadius: 20, 
              padding: 32, 
              alignItems: "center", 
              maxWidth: 500,
              width: '100%',
              borderWidth: 1,
              borderColor: colors.border,
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
            }}>
              <View style={{ 
                width: 60, 
                height: 60, 
                borderRadius: 30, 
                backgroundColor: colors.destructive + '20',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20
              }}>
                <Ionicons name="alert-circle" size={32} color={colors.destructive} />
              </View>
              <Text style={{ 
                color: colors.foreground, 
                fontSize: 20, 
                fontWeight: '700', 
                marginBottom: 12,
                textAlign: 'center'
              }}>
                {errorModalTitle}
              </Text>
              <Text style={{ 
                color: colors.mutedForeground, 
                fontSize: 16, 
                textAlign: 'center',
                lineHeight: 22,
                marginBottom: 24
              }}>
                {errorModalMessage}
              </Text>
              
              {/* Action Buttons */}
              <View style={{ 
                flexDirection: 'row', 
                gap: 12, 
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}>
                {errorModalActions.length > 0 ? (
                  errorModalActions.map((action, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={action.onPress}
                      style={{
                        paddingHorizontal: 20,
                        paddingVertical: 12,
                        borderRadius: 12,
                        backgroundColor: index === 0 ? colors.primary : colors.secondary,
                        minWidth: 100
                      }}
                    >
                      <Text style={{ 
                        color: index === 0 ? colors.primaryForeground : colors.secondaryForeground, 
                        fontWeight: '600',
                        textAlign: 'center'
                      }}>
                        {action.text}
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <TouchableOpacity
                    onPress={hideError}
                    style={{
                      paddingHorizontal: 24,
                      paddingVertical: 12,
                      borderRadius: 12,
                      backgroundColor: colors.primary,
                      minWidth: 100
                    }}
                  >
                    <Text style={{ 
                      color: colors.primaryForeground, 
                      fontWeight: '600',
                      textAlign: 'center'
                    }}>
                      OK
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </Modal>
        
        {/* Sticky bottom action bar */}
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, borderTopWidth: 1, borderColor: colors.border, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: colors.background, zIndex: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 12 }}>
            <Pressable style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: 'transparent' }}>
              <Text style={{ color: colors.foreground, fontWeight: '600' }}>Save Draft</Text>
            </Pressable>
            <TouchableOpacity
             onPress={submitShowoff}
              style={{ 
                paddingHorizontal: 16, 
                paddingVertical: 10, 
                borderRadius: 12, 
                backgroundColor: loading || uploadingImage ? colors.muted : colors.primary,
                opacity: loading || uploadingImage ? 0.6 : 1
              }}
              disabled={loading || uploadingImage}
            >
              <Text style={{ color: colors.primaryForeground, fontWeight: '700' }}>
                {uploadingImage ? 'Uploading Image...' : loading ? 'Publishing...' : 'Publish Showoff'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  

