<template>
  <v-container class="pa-3" fluid>
    <!-- 頁面標題區域 -->
    <v-row class="mb-1">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between">
          <div>
            <h1 class="text-h4 font-weight-bold text-primary mb-2">
              <v-icon class="me-3" size="32">mdi-account-group</v-icon>
              使用者管理
            </h1>
            <p class="text-body-1 text-medium-emphasis mt-3">
              管理系統中的所有使用者帳號
            </p>
          </div>
          <v-btn
            class="px-6 mb-2"
            color="primary"
            elevation="2"
            prepend-icon="mdi-plus"
            size="large"
            @click="openCreateDialog"
          >
            新增使用者
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- 統計卡片 -->
    <v-row class="mb-6">
      <v-col cols="12" md="3">
        <v-card class="text-center pa-4" elevation="2">
          <v-icon
            class="mb-3"
            color="primary"
            size="48"
          >mdi-account-multiple</v-icon>
          <h3 class="text-h4 font-weight-bold text-primary">
            {{ users.length }}
          </h3>
          <p class="text-body-2 text-medium-emphasis">總使用者數</p>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="text-center pa-4" elevation="2">
          <v-icon class="mb-3" color="success" size="48">mdi-account</v-icon>
          <h3 class="text-h4 font-weight-bold text-success">{{ userCount }}</h3>
          <p class="text-body-2 text-medium-emphasis">一般使用者</p>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="text-center pa-4" elevation="2">
          <v-icon class="mb-3" color="error" size="48">mdi-shield-crown</v-icon>
          <h3 class="text-h4 font-weight-bold text-error">{{ adminCount }}</h3>
          <p class="text-body-2 text-medium-emphasis">管理員</p>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="text-center pa-4" elevation="2">
          <v-icon
            class="mb-3"
            color="info"
            size="48"
          >mdi-calendar-today</v-icon>
          <h3 class="text-h4 font-weight-bold text-info">{{ todayCount }}</h3>
          <p class="text-body-2 text-medium-emphasis">今日新增</p>
        </v-card>
      </v-col>
    </v-row>

    <!-- 搜尋和篩選區域 -->
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="search"
          clearable
          density="comfortable"
          label="搜尋使用者"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-select
          v-model="roleFilter"
          clearable
          density="comfortable"
          :items="roleOptions"
          label="角色篩選"
          variant="outlined"
        />
      </v-col>
      <v-col class="d-flex align-center" cols="12" md="3">
        <v-btn
          class="w-100 mb-6"
          color="primary"
          height="45px"
          :loading="loading"
          prepend-icon="mdi-refresh"
          variant="outlined"
          @click="refreshUsers"
        >
          重新整理
        </v-btn>
      </v-col>
    </v-row>

    <!-- 使用者列表 -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <v-data-table
            class="elevation-0"
            density="default"
            :headers="headers"
            hover
            :items="filteredUsers"
            :loading="loading"
            :search="search"
          >
            <!-- 帳號欄位 -->
            <template #item.account="{ item }">
              <div class="d-flex align-center">
                <v-avatar class="me-3" color="primary" size="32">
                  <span class="text-white font-weight-bold">{{
                    item.account.charAt(0).toUpperCase()
                  }}</span>
                </v-avatar>
                <div>
                  <div class="font-weight-medium">{{ item.account }}</div>
                  <div class="text-caption text-medium-emphasis">
                    ID: {{ item._id.slice(-6) }}
                  </div>
                </div>
              </div>
            </template>

            <!-- 電子郵件欄位 -->
            <template #item.email="{ item }">
              <div class="d-flex align-center">
                <v-icon class="me-2" color="grey" size="16">mdi-email</v-icon>
                {{ item.email }}
              </div>
            </template>

            <!-- 密碼欄位 -->
            <!-- <template #item.password="{ item }">
              <div class="d-flex align-center">
                <v-icon class="me-2" color="warning" size="16">mdi-lock</v-icon>
                <div v-if="showPasswords" class="font-family-mono">
                  {{ item.password || '未設定' }}
                </div>
                <div v-else class="text-medium-emphasis">
                  ••••••••
                </div>
              </div>
            </template> -->

            <!-- // 修改角色顯示模板 -->
            <template #item.role="{ item }">
              <v-chip
                class="font-weight-medium"
                :color="getRoleColor(item.role)"
                size="small"
                variant="elevated"
              >
                <v-icon class="me-1" size="16">
                  {{ getRoleIcon(item.role) }}
                </v-icon>
                {{ getRoleText(item.role) }}
              </v-chip>
            </template>

            <!-- 建立時間欄位 -->
            <template #item.createdAt="{ item }">
              <div class="d-flex align-center">
                <v-icon
                  class="me-2"
                  color="grey"
                  size="16"
                >mdi-calendar</v-icon>
                {{ formatDate(item.createdAt) }}
              </div>
            </template>

            <!-- 操作欄位 -->
            <template #item.actions="{ item }">
              <div class="d-flex gap-2">
                <v-btn
                  class="me-1"
                  color="warning"
                  :disabled="!canEditUser(item)"
                  icon="mdi-pencil"
                  size="small"
                  title="編輯使用者"
                  variant="tonal"
                  @click="editUser(item)"
                />
                <v-btn
                  color="error"
                  :disabled="!canDeleteUser(item)"
                  icon="mdi-delete"
                  size="small"
                  title="刪除使用者"
                  variant="tonal"
                  @click="confirmDelete(item)"
                />
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- 新增使用者對話框 -->
    <v-dialog v-model="createDialog" max-width="500px" persistent>
      <v-card>
        <v-card-title class="text-h5 font-weight-bold pa-6 pb-4">
          <v-icon
            class="me-3"
            color="primary"
            size="28"
          >mdi-account-plus</v-icon>
          新增使用者
        </v-card-title>
        <v-card-text class="pa-6 pt-0">
          <v-form ref="createForm" v-model="createFormValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newUser.account"
                  density="comfortable"
                  label="帳號 *"
                  prepend-inner-icon="mdi-account"
                  :rules="[rules.required, rules.account]"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newUser.email"
                  density="comfortable"
                  label="電子郵件 *"
                  prepend-inner-icon="mdi-email"
                  :rules="[rules.required, rules.email]"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newUser.password"
                  density="comfortable"
                  label="密碼 *"
                  prepend-inner-icon="mdi-lock"
                  :rules="[rules.required, rules.password]"
                  :type="showCreatePassword ? 'text' : 'password'"
                  variant="outlined"
                >
                  <template #append-inner>
                    <v-btn
                      icon="mdi-eye"
                      size="small"
                      variant="text"
                      @click="showCreatePassword = !showCreatePassword"
                    />
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="newUser.role"
                  density="comfortable"
                  :items="availableRoleOptions"
                  label="角色 *"
                  prepend-inner-icon="mdi-shield"
                  :rules="[rules.required]"
                  variant="outlined"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn
            class="px-6"
            color="grey"
            variant="outlined"
            @click="closeCreateDialog"
          >
            取消
          </v-btn>
          <v-btn
            class="px-6"
            color="primary"
            :disabled="!createFormValid"
            :loading="creating"
            @click="createUser"
          >
            新增
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 編輯使用者對話框 -->
    <v-dialog v-model="editDialog" max-width="500px" persistent>
      <v-card>
        <v-card-title class="text-h5 font-weight-bold pa-6 pb-4">
          <v-icon
            class="me-3"
            color="warning"
            size="28"
          >mdi-account-edit</v-icon>
          編輯使用者
        </v-card-title>
        <v-card-text v-if="editingUser" class="pa-6 pt-0">
          <v-form ref="editForm" v-model="editFormValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editingUser.account"
                  density="comfortable"
                  label="帳號"
                  prepend-inner-icon="mdi-account"
                  :rules="[rules.required, rules.account]"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editingUser.email"
                  density="comfortable"
                  label="電子郵件"
                  prepend-inner-icon="mdi-email"
                  :rules="[rules.required, rules.email]"
                  variant="outlined"
                />
              </v-col>
              <!-- 密碼 -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editingUser.password"
                  density="comfortable"
                  label="新密碼 (留空則不修改)"
                  prepend-inner-icon="mdi-lock"
                  :rules="[rules.password]"
                  :type="showEditPassword ? 'text' : 'password'"
                  variant="outlined"
                >
                  <template #append-inner>
                    <v-btn
                      icon="mdi-eye"
                      size="small"
                      variant="text"
                      @click="showEditPassword = !showEditPassword"
                    />
                  </template>
                </v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="editingUser.role"
                  density="comfortable"
                  :items="roleOptions"
                  label="角色"
                  prepend-inner-icon="mdi-shield"
                  :rules="[rules.required]"
                  variant="outlined"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn
            class="px-6"
            color="grey"
            variant="outlined"
            @click="editDialog = false"
          >
            取消
          </v-btn>
          <v-btn
            class="px-6"
            color="primary"
            :disabled="!editFormValid"
            :loading="saving"
            @click="saveUser"
          >
            儲存
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 刪除確認對話框 -->
    <v-dialog v-model="deleteDialog" max-width="400px" persistent>
      <v-card>
        <v-card-title class="text-h5 font-weight-bold pa-6 pb-4 text-center">
          <v-icon class="me-3" color="error" size="32">mdi-alert-circle</v-icon>
          確認刪除
        </v-card-title>
        <v-card-text class="pa-6 pt-0 text-center">
          <p class="text-body-1 mb-4">
            確定要刪除使用者
            <strong class="text-error">{{ userToDelete?.account }}</strong> 嗎？
          </p>
          <p class="text-body-2 text-medium-emphasis">
            此操作無法復原，請謹慎操作。
          </p>
        </v-card-text>
        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn
            class="px-6"
            color="grey"
            variant="outlined"
            @click="deleteDialog = false"
          >
            取消
          </v-btn>
          <v-btn
            class="px-6"
            color="error"
            :loading="deleting"
            @click="deleteUser"
          >
            刪除
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 成功訊息 -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      location="top"
      :timeout="3000"
    >
      <div class="d-flex align-center">
        <v-icon class="me-3">
          {{
            snackbar.color === "success"
              ? "mdi-check-circle"
              : "mdi-alert-circle"
          }}
        </v-icon>
        {{ snackbar.message }}
      </div>
    </v-snackbar>
  </v-container>
</template>

<script>
  import userService from '@/services/user'
  import { useUserStore } from '@/stores/user' // 添加這行導入

  export default {
    name: 'AdminIndex',
    data () {
      return {
        users: [],
        loading: false,
        saving: false,
        deleting: false,
        creating: false,
        search: '',
        roleFilter: null,
        editDialog: false,
        deleteDialog: false,
        createDialog: false,
        editingUser: null,
        userToDelete: null,
        editFormValid: false,
        createFormValid: false,
        showPasswords: false, // 新增：控制表格中密碼顯示
        showCreatePassword: false, // 新增：控制新增對話框中密碼顯示
        showEditPassword: false, // 新增：控制編輯對話框中密碼顯示
        newUser: {
          account: '',
          email: '',
          password: '',
          role: 'user',
        },
        snackbar: {
          show: false,
          message: '',
          color: 'success',
        },
        headers: [
          { title: '帳號', key: 'account', sortable: true },
          { title: '電子郵件', key: 'email', sortable: true },
          // { title: '密碼', key: 'password', sortable: false, width: '200px' }, // 新增密碼欄位
          { title: '角色', key: 'role', sortable: true },
          { title: '建立時間', key: 'createdAt', sortable: true },
          { title: '操作', key: 'actions', sortable: false },
        ],
        roleOptions: [
          { title: '一般使用者', value: 'user' },
          { title: '管理員', value: 'admin' },
          { title: '系統管理員', value: 'root' },
        ],
        rules: {
          required: v => !!v || '此欄位為必填',
          account: v =>
            /^[a-zA-Z0-9]{4,20}$/.test(v)
            || '帳號只能包含英文字母和數字，長度4-20字元',
          email: v => /.+@.+\..+/.test(v) || '請輸入有效的電子郵件地址',
          password: v =>
            !v
            || (v.length >= 4 && v.length <= 20)
            || '密碼長度必須在4-20字元之間',
        },
      }
    },
    computed: {
      // 根據當前使用者權限顯示可選的角色選項
      availableRoleOptions () {
        const userStore = useUserStore()
        if (userStore.role === 'root') {
          return this.roleOptions // 系統管理員可以創建所有角色
        } else if (userStore.role === 'admin') {
          // 一般管理員可以創建一般使用者和管理員，但不能創建系統管理員
          return this.roleOptions.filter(role => role.value !== 'root')
        }
        return []
      },

      // 在 computed 中添加 root 統計
      rootCount () {
        return this.users.filter(user => user.role === 'root').length
      },

      filteredUsers () {
        let filtered = this.users

        // 角色篩選
        if (this.roleFilter) {
          filtered = filtered.filter(user => user.role === this.roleFilter)
        }

        return filtered
      },
      userCount () {
        return this.users.filter(user => user.role === 'user').length
      },
      adminCount () {
        return this.users.filter(user => user.role === 'admin').length
      },
      todayCount () {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return this.users.filter(user => {
          const userDate = new Date(user.createdAt)
          userDate.setHours(0, 0, 0, 0)
          return userDate.getTime() === today.getTime()
        }).length
      },
    },
    mounted () {
      this.loadUsers()
    },
    methods: {
      async loadUsers () {
        this.loading = true
        try {
          const response = await userService.getAllUsers()
          this.users = response.data.result
        } catch (error) {
          console.error('載入使用者失敗:', error)
          this.showSnackbar('載入使用者失敗', 'error')
        } finally {
          this.loading = false
        }
      },

      // 檢查是否可以編輯使用者
      canEditUser (user) {
        const userStore = useUserStore()
        if (userStore.role === 'root') {
          return true // 系統管理員可以編輯所有使用者
        } else if (userStore.role === 'admin') {
          return user.role !== 'root' // 一般管理員可以編輯一般使用者和管理員，但不能編輯系統管理員
        }
        return false
      },

      // 檢查是否可以刪除使用者
      canDeleteUser (user) {
        const userStore = useUserStore()
        if (userStore.role === 'root') {
          return user.role !== 'root' // 系統管理員不能刪除自己
        } else if (userStore.role === 'admin') {
          return user.role !== 'root' // 一般管理員可以刪除一般使用者和管理員，但不能刪除系統管理員
        }
        return false
      },

      // 在 methods 中添加角色相關方法
      getRoleColor (role) {
        switch (role) {
          case 'root': {
            return 'purple'
          }
          case 'admin': {
            return 'error'
          }
          default: {
            return 'success'
          }
        }
      },

      getRoleIcon (role) {
        switch (role) {
          case 'root': {
            return 'mdi-shield-crown'
          }
          case 'admin': {
            return 'mdi-shield'
          }
          default: {
            return 'mdi-account'
          }
        }
      },

      getRoleText (role) {
        switch (role) {
          case 'root': {
            return '系統管理員'
          }
          case 'admin': {
            return '管理員'
          }
          default: {
            return '一般使用者'
          }
        }
      },
      refreshUsers () {
        this.loadUsers()
      },
      openCreateDialog () {
        this.createDialog = true
        this.resetNewUser()
      },
      closeCreateDialog () {
        this.createDialog = false
        this.resetNewUser()
        this.showCreatePassword = false // 重置密碼顯示狀態
      },
      resetNewUser () {
        this.newUser = {
          account: '',
          email: '',
          password: '',
          role: 'user',
        }
        if (this.$refs.createForm) {
          this.$refs.createForm.resetValidation()
        }
      },
      // 在 methods 中修改 createUser 方法
      async createUser () {
        if (!this.$refs.createForm.validate()) return

        // 檢查權限
        const userStore = useUserStore()
        if (userStore.role === 'admin' && this.newUser.role === 'root') {
          this.showSnackbar('一般管理員不能建立系統管理員', 'error')
          return
        }

        this.creating = true
        try {
          const response = await userService.createUser(this.newUser)
          this.users.unshift(response.data.result)
          this.closeCreateDialog()
          this.showSnackbar('使用者建立成功', 'success')
        } catch (error) {
          console.error('建立使用者失敗:', error)
          this.showSnackbar(
            error.response?.data?.message || '建立使用者失敗',
            'error',
          )
        } finally {
          this.creating = false
        }
      },
      // 修改 editUser 方法
      editUser (user) {
        // 檢查權限
        if (!this.canEditUser(user)) {
          this.showSnackbar('您沒有權限編輯此使用者', 'error')
          return
        }

        this.editingUser = {
          ...user,
          password: '', // 清空密碼欄位
        }
        this.editDialog = true
        this.showEditPassword = false
      },

      async saveUser () {
        if (!this.$refs.editForm.validate()) return

        this.saving = true
        try {
          const updateData = { ...this.editingUser }

          // 如果密碼為空，則不更新密碼
          if (!updateData.password) {
            delete updateData.password
          }

          await userService.updateUser(this.editingUser._id, updateData)

          // 更新本地資料
          const index = this.users.findIndex(
            u => u._id === this.editingUser._id,
          )
          if (index !== -1) {
            this.users[index] = { ...this.editingUser }
            if (updateData.password) {
              delete this.users[index].password
            }
          }

          this.editDialog = false
          this.showSnackbar('使用者資料更新成功', 'success')
        } catch (error) {
          console.error('更新使用者失敗:', error)
          this.showSnackbar(
            error.response?.data?.message || '更新使用者失敗',
            'error',
          )
        } finally {
          this.saving = false
        }
      },
      // 修改 confirmDelete 方法
      confirmDelete (user) {
        // 檢查權限
        if (!this.canDeleteUser(user)) {
          this.showSnackbar('您沒有權限刪除此使用者', 'error')
          return
        }

        this.userToDelete = user
        this.deleteDialog = true
      },
      async deleteUser () {
        this.deleting = true
        try {
          await userService.deleteUser(this.userToDelete._id)

          // 從本地列表中移除
          this.users = this.users.filter(u => u._id !== this.userToDelete._id)

          this.deleteDialog = false
          this.showSnackbar('使用者刪除成功', 'success')
        } catch (error) {
          console.error('刪除使用者失敗:', error)
          this.showSnackbar(
            error.response?.data?.message || '刪除使用者失敗',
            'error',
          )
        } finally {
          this.deleting = false
        }
      },
      formatDate (date) {
        return new Date(date).toLocaleString('zh-TW', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })
      },
      showSnackbar (message, color = 'success') {
        this.snackbar = {
          show: true,
          message,
          color,
        }
      },
    },
  }
</script>

<route lang="yaml">
meta:
  layout: "admin"
  title: "管理者後台"
  login: "login-only"
  admin: true
</route>
