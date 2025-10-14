"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { AnimatePresence, motion } from "motion/react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { createUser } from "@/lib/supabase/actions/clerk"
import { getUnclaimedUsers } from "@/lib/supabase/actions/profile"
import CustomButton from "@/components/custom-button"
import MyInput from "@/components/Forms/components/Input"
import ImageUpload from "@/app/[username]/edit/components/ImageUpload"

// Define validation schema for creating new unclaimed user
const newUserSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  avatar_url: z.string().min(1, "Profile picture is required"),
})

type NewUserFormValues = z.infer<typeof newUserSchema>

interface UnclaimedUser {
  user_id: string
  username: string
  avatar_url: string | null
  display_name: string | null
  is_unclaimed: boolean
}

interface UnclaimedUserSelectorProps {
  onUserSelected: (userId: string) => void
  selectedUserId?: string
}

export default function UnclaimedUserSelector({
  onUserSelected,
  selectedUserId,
}: UnclaimedUserSelectorProps) {
  const [mode, setMode] = useState<"select" | "create">("select")
  const [unclaimedUsers, setUnclaimedUsers] = useState<UnclaimedUser[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [hasSearched, setHasSearched] = useState(false)
  const { user } = useUser()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<NewUserFormValues>({
    resolver: zodResolver(newUserSchema),
    defaultValues: {
      avatar_url: "",
    },
  })

  // Watch the avatar URL to update preview
  const avatarUrl = watch("avatar_url")

  const searchUnclaimedUsers = async (query: string) => {
    if (!query.trim()) {
      setUnclaimedUsers([])
      setHasSearched(false)
      return
    }

    try {
      setLoadingUsers(true)
      setHasSearched(true)
      const users = await getUnclaimedUsers()
      const filtered = (users || []).filter((user) => {
        const searchLower = query.toLowerCase()
        return (
          user.username.toLowerCase().includes(searchLower) ||
          user.display_name?.toLowerCase().includes(searchLower) ||
          user.user_id.toLowerCase().includes(searchLower)
        )
      })
      setUnclaimedUsers(filtered)
    } catch (error) {
      console.error("Error searching unclaimed users:", error)
      toast.error("Failed to search unclaimed users")
    } finally {
      setLoadingUsers(false)
    }
  }

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchUnclaimedUsers(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  if (!user || !user.id) {
    return <div>Loading...</div>
  }

  const handleCreateUser = async (data: NewUserFormValues) => {
    try {
      setIsCreating(true)

      // Generate a random password for unclaimed user
      const randomPassword = Math.random().toString(36).slice(-8) + "Aa1!"

      // Create the user in Clerk
      const newUser = await createUser({
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        password: randomPassword,
        username: data.username,
        avatar_url: data.avatar_url || "",
      })

      // Add the new user to the local list
      const newUnclaimedUser: UnclaimedUser = {
        user_id: newUser.id,
        username: data.username,
        avatar_url: data.avatar_url || newUser.imageUrl || null,
        display_name: `${data.first_name} ${data.last_name}`,
        is_unclaimed: true,
      }

      setUnclaimedUsers((prev) => [newUnclaimedUser, ...prev])
      onUserSelected(newUser.id)

      // Reset form and switch back to select mode
      reset()
      setMode("select")

      toast.success("New unclaimed user created successfully!")
    } catch (error: any) {
      console.error("Error creating user:", error)
      toast.error(error.message || "Failed to create user")
    } finally {
      setIsCreating(false)
    }
  }

  const handleUserSelect = (user: UnclaimedUser) => {
    onUserSelected(user.user_id)
  }

  const selectedUser = unclaimedUsers.find(
    (user) => user.user_id === selectedUserId
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-medium text-black">Project Owner</h3>
        <p className="text-[#ACACAC] text-base">
          Search for an existing unclaimed user or create a new one
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 p-1 border border-[#EAEAEA] rounded-xl w-fit">
        <button
          type="button"
          onClick={() => setMode("select")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === "select"
              ? "bg-black text-white"
              : "text-gray-600 hover:text-black"
          }`}
        >
          Select Existing
        </button>
        <button
          type="button"
          onClick={() => setMode("create")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === "create"
              ? "bg-black text-white"
              : "text-gray-600 hover:text-black"
          }`}
        >
          Create New
        </button>
      </div>

      <AnimatePresence mode="wait">
        {mode === "select" ? (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Selected User Display */}
            {selectedUser && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    {selectedUser.avatar_url ? (
                      <img
                        src={selectedUser.avatar_url}
                        alt={selectedUser.username}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-600 font-medium">
                        {selectedUser.display_name?.charAt(0) ||
                          selectedUser.username.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-green-800">
                      {selectedUser.display_name || selectedUser.username}
                    </p>
                    <p className="text-sm text-green-600">
                      @{selectedUser.username}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Search Bar */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                Search Unclaimed Users
              </label>
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by username or name..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Search Results */}
            {hasSearched && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Search Results</h4>

                {loadingUsers ? (
                  <div className="p-8 text-center text-gray-500">
                    Searching...
                  </div>
                ) : unclaimedUsers.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No unclaimed users found matching &quot;{searchQuery}&quot;
                  </div>
                ) : (
                  <div className="grid gap-2 max-h-60 overflow-y-auto">
                    {unclaimedUsers.map((user) => (
                      <button
                        key={user.user_id}
                        type="button"
                        onClick={() => handleUserSelect(user)}
                        className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${
                          selectedUserId === user.user_id
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
                          {user.avatar_url ? (
                            <img
                              src={user.avatar_url}
                              alt={user.username}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-gray-600 font-medium">
                              {user.display_name?.charAt(0) ||
                                user.username.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {user.display_name || user.username}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            @{user.username}
                          </p>
                        </div>
                        {selectedUserId === user.user_id && (
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                            <svg
                              className="w-3 h-3 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="create"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="space-y-4">
              <div className="flex flex-row gap-4 items-end">
                {/* Avatar Upload */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Profile Picture *
                  </label>
                  <ImageUpload
                    label="Profile Picture"
                    currentImageUrl={avatarUrl}
                    onImageUploaded={(url: string) =>
                      setValue("avatar_url", url)
                    }
                    onImageRemoved={() => setValue("avatar_url", "")}
                    bucketName="unclaimed-profiles"
                    folder="avatars"
                    aspectRatio="aspect-square"
                    className="size-32 rounded-xl"
                    displayAreaClassName="rounded-xl"
                    userId={user.id}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 w-96">
                  <MyInput
                    label="First Name *"
                    type="text"
                    {...register("first_name")}
                    isInvalid={!!errors.first_name}
                    errorMessage={errors.first_name?.message}
                  />
                  <MyInput
                    label="Last Name *"
                    type="text"
                    {...register("last_name")}
                    isInvalid={!!errors.last_name}
                    errorMessage={errors.last_name?.message}
                  />
                </div>
              </div>

              <MyInput
                label="Email *"
                type="email"
                {...register("email")}
                isInvalid={!!errors.email}
                errorMessage={errors.email?.message}
              />

              <MyInput
                label="Username *"
                type="text"
                {...register("username")}
                isInvalid={!!errors.username}
                errorMessage={errors.username?.message}
                placeholder="e.g. johnsmith"
              />

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-yellow-600 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Note</p>
                    <p className="text-sm text-yellow-700">
                      This will create an unclaimed user account. A temporary
                      password will be generated automatically. The user can
                      claim their account later using the provided credentials.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleSubmit(handleCreateUser)}
                  disabled={isCreating}
                  className="flex-1 bg-black text-white px-6 py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? "Creating User..." : "Create Unclaimed User"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    reset()
                    setValue("avatar_url", "")
                    setMode("select")
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
