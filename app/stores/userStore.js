// stores/userStore.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: process.client ? JSON.parse(localStorage.getItem('users') || '[]') : [],
    currentUser: process.client ? JSON.parse(localStorage.getItem('currentUser') || 'null') : null,
  }),

  actions: {
    updatePassword(newPassword) {
      if (!process.client) return
      if (this.currentUser) {
        this.currentUser.password = newPassword

        const index = this.users.findIndex(
          u => u.email === this.currentUser.email || u.phone === this.currentUser.phone
        )

        if (index !== -1) {
          this.users[index].password = newPassword
        }

        localStorage.setItem('users', JSON.stringify(this.users))
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser))
      }
    },

    loadUsers() {
    if (!process.client) return
    this.users = JSON.parse(localStorage.getItem('users') || '[]')
  },

    //Signup action
    signup(newUser) {
      if (!process.client) return { success: false, message: 'Client only action' }

          this.loadUsers()

      const exists = this.users.find(
        u => u.email === newUser.email || u.phone === newUser.phone
      )

      if (exists) {
        return { success: false, message: 'Email or phone already registered.' }
      }

      const userWithAvatar = {
        ...newUser,
        avatar: '/games/ProfileAvatar.png',
        memberSince: new Date().getFullYear(),
      }

      this.users.push(userWithAvatar)
      localStorage.setItem('users', JSON.stringify(this.users))

      return { success: true, message: 'Signup successful!' }
    },

    //Reset Password
    resetPassword(identifier, newPassword) {
      if (!process.client) return { success: false, message: 'Client only action' }

      const userIndex = this.users.findIndex(
        u => u.email === identifier || u.phone === identifier
      )

      if (userIndex === -1) {
        return { success: false, message: 'User not found.' }
      }

      this.users[userIndex].password = newPassword

      if (
        this.currentUser &&
        (this.currentUser.email === identifier || this.currentUser.phone === identifier)
      ) {
        this.currentUser.password = newPassword
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser))
      }

      localStorage.setItem('users', JSON.stringify(this.users))

      return { success: true, message: 'Password updated successfully.' }
    },

    //Login action
    login(identifier, password) {
      if (!process.client) return { success: false, message: 'Client only action' }

         this.loadUsers()

      const found = this.users.find(
        u =>
          (u.email === identifier || u.phone === identifier) &&
          u.password === password
      )

      if (!found) {
        return { success: false, message: 'Invalid email/phone or password.' }
      }

      this.currentUser = found
      localStorage.setItem('currentUser', JSON.stringify(found))

      return { success: true, message: 'Login successful!' }
    },

    logout() {
      if (!process.client) return
      this.currentUser = null
      localStorage.removeItem('currentUser')
    },

    //Update profile image
    updateProfileImage(newImage) {
      if (!process.client || !this.currentUser) return

      this.currentUser.avatar = newImage

      const index = this.users.findIndex(u => u.email === this.currentUser.email)
      if (index !== -1) {
        this.users[index] = { ...this.currentUser }
      }

      localStorage.setItem('users', JSON.stringify(this.users))
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser))
    },
  },
  loadFromLocalStorage() {
  if (!process.client) return
  this.users = JSON.parse(localStorage.getItem('users') || '[]')
  this.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')
}

})
