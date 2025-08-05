"use client"

import { useState } from 'react'
import { X, Edit2, Camera, Mail, Calendar } from 'lucide-react'
import { useUser } from '@clerk/nextjs'

type UserResource = NonNullable<ReturnType<typeof useUser>['user']>
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'

interface UserProfileProps {
  user: UserResource
  onClose: () => void
}

export function UserProfile({ user, onClose }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    username: user.username || '',
    bio: '', // This would come from your database
    status: 'online' as 'online' | 'away' | 'busy' | 'offline',
  })

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const handleSave = () => {
    // TODO: Implement profile update with Convex
    console.log('Updating profile:', formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      username: user.username || '',
      bio: '',
      status: 'online',
    })
    setIsEditing(false)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Profile</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Avatar Section */}
          <div className="text-center">
            <div className="relative inline-block">
              <Avatar className="w-24 h-24 mx-auto">
                <AvatarImage src={user.imageUrl} />
                <AvatarFallback className="text-2xl">
                  {getInitials(user.firstName + ' ' + user.lastName || user.username || 'U')}
                </AvatarFallback>
              </Avatar>
              
              {isEditing && (
                <Button
                  size="icon"
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full"
                  onClick={() => console.log('Change avatar')}
                >
                  <Camera className="w-4 h-4" />
                </Button>
              )}
            </div>

            {!isEditing ? (
              <div className="mt-4">
                <h2 className="text-xl font-semibold">
                  {user.firstName} {user.lastName}
                </h2>
                {user.username && (
                  <p className="text-muted-foreground">@{user.username}</p>
                )}
                <div className="flex items-center justify-center space-x-2 mt-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">Online</span>
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="firstName" className="text-sm">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-sm">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Last name"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="username" className="text-sm">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="Username"
                  />
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              Contact Information
            </h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Email</span>
                <span>{user.emailAddresses[0]?.emailAddress}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Phone</span>
                <span className="text-muted-foreground">Not provided</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Bio Section */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm">About</h3>
            
            {!isEditing ? (
              <p className="text-sm text-muted-foreground">
                {formData.bio || 'No bio provided yet.'}
              </p>
            ) : (
              <div>
                <Label htmlFor="bio" className="text-sm">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell others about yourself..."
                  rows={3}
                />
              </div>
            )}
          </div>

          <Separator />

          {/* Account Information */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Account
            </h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Joined</span>
                <span>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Last updated</span>
                <span>{user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'Unknown'}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-4">
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="flex-1"
                variant="outline"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex-1"
                >
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}