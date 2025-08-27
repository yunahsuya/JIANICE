<template>
  <v-container fluid class="pa-6">
    <!-- 頁面標題區域 -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between">
          <div>
            <h1 class="text-h4 font-weight-bold text-primary mb-2">
              <v-icon size="32" class="me-3">mdi-account-group</v-icon>
              使用者管理
            </h1>
            <p class="text-body-1 text-medium-emphasis">
              管理系統中的所有使用者帳號
            </p>
          </div>
          <v-btn
            color="primary"
            size="large"
            prepend-icon="mdi-plus"
            @click="openCreateDialog"
            elevation="2"
            class="px-6"
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
          <v-icon size="48" color="primary" class="mb-3">mdi-account-multiple</v-icon>
          <h3 class="text-h4 font-weight-bold text-primary">{{ users.length }}</h3>
          <p class="text-body-2 text-medium-emphasis">總使用者數</p>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="text-center pa-4" elevation="2">
          <v-icon size="48" color="success" class="mb-3">mdi-account</v-icon>
          <h3 class="text-h4 font-weight-bold text-success">{{ userCount }}</h3>
          <p class="text-body-2 text-medium-emphasis">一般使用者</p>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="text-center pa-4" elevation="2">
          <v-icon size="48" color="error" class="mb-3">mdi-shield-crown</v-icon>
          <h3 class="text-h4 font-weight-bold text-error">{{ adminCount }}</h3>
          <p class="text-body-2 text-medium-emphasis">管理員</p>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="text-center pa-4" elevation="2">
          <v-icon size="48" color="info" class="mb-3">mdi-calendar-today</v-icon>
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
                label="搜尋使用者"
                prepend-inner-icon="mdi-magnify"
                clearable
                variant="outlined"
                density="comfortable"
                bg-color="surface"
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="roleFilter"
                label="角色篩選"
                :items="roleOptions"
                variant="outlined"
                density="comfortable"
                clearable
                bg-color="surface"
              />
            </v-col>
            <v-col cols="12" md="3" class="d-flex align-center">
              <v-btn
                color="primary"
                variant="outlined"
                prepend-icon="mdi-refresh"
                @click="refreshUsers"
                :loading="loading"
                class="w-100"
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
            :headers="headers"
            :items="filteredUsers"
            :loading="loading"
            :search="search"
            class="elevation-0"
            density="comfortable"
            hover
          >
            <!-- 帳號欄位 -->
            <template v-slot:item.account="{ item }">
              <div class="d-flex align-center">
                <v-avatar size="32" color="primary" class="me-3">
                  <span class="text-white font-weight-bold">{{ item.account.charAt(0).toUpperCase() }}</span>
                </v-avatar>
                <div>
                  <div class="font-weight-medium">{{ item.account }}</div>
                  <div class="text-caption text-medium-emphasis">ID: {{ item._id.slice(-6) }}</div>
                </div>
              </div>
            </template>

            <!-- 電子郵件欄位 -->
            <template v-slot:item.email="{ item }">
              <div class="d-flex align-center">
                <v-icon size="16" color="grey" class="me-2">mdi-email</v-icon>
                {{ item.email }}
              </div>
            </template>

            <!-- 角色欄位 -->
            <template v-slot:item.role="{ item }">
              <v-chip
                :color="item.role === 'admin' ? 'error' : 'success'"
                size="small"
                variant="elevated"
                class="font-weight-medium"
              >
                <v-icon size="16" class="me-1">
                  {{ item.role === 'admin' ? 'mdi-shield-crown' : 'mdi-account' }}
                </v-icon>
                {{ item.role === 'admin' ? '管理員' : '一般使用者' }}
              </v-chip>
            </template>

            <!-- 建立時間欄位 -->
            <template v-slot:item.createdAt="{ item }">
              <div class="d-flex align-center">
                <v-icon size="16" color="grey" class="me-2">mdi-calendar</v-icon>
                {{ formatDate(item.createdAt) }}
              </div>
            </template>

            <!-- 操作欄位 -->
            <template v-slot:item.actions="{ item }">
              <div class="d-flex gap-2">
                <v-btn
                  icon="mdi-eye"
                  size="small"
                  color="info"
                  variant="tonal"
                  @click="viewUser(item)"
                  title="查看詳細"
                />
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  color="warning"
                  variant="tonal"
                  @click="editUser(item)"
                  title="編輯使用者"
                />
                <v-btn
                  icon="mdi-delete"
                  size="small"
                  color="error"
                  variant="tonal"
                  @click="confirmDelete(item)"
                  :disabled="item.role === 'admin'"
                  title="刪除使用者"
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
          <v-icon size="28" color="primary" class="me-3">mdi-account-plus</v-icon>
          新增使用者
        </v-card-title>
        <v-card-text class="pa-6 pt-0">
          <v-form ref="createForm" v-model="createFormValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newUser.account"
                  label="帳號 *"
                  variant="outlined"
                  density="comfortable"
                  :rules="[rules.required, rules.account]"
                  prepend-inner-icon="mdi-account"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newUser.email"
                  label="電子郵件 *"
                  variant="outlined"
                  density="comfortable"
                  :rules="[rules.required, rules.email]"
                  prepend-inner-icon="mdi-email"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newUser.password"
                  label="密碼 *"
                  type="password"
                  variant="outlined"
                  density="comfortable"
                  :rules="[rules.required, rules.password]"
                  prepend-inner-icon="mdi-lock"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="newUser.role"
                  label="角色 *"
                  :items="roleOptions"
                  variant="outlined"
                  density="comfortable"
                  :rules="[rules.required]"
                  prepend-inner-icon="mdi-shield"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn
            color="grey"
            variant="outlined"
            @click="closeCreateDialog"
            class="px-6"
          >
            取消
          </v-btn>
          <v-btn
            color="primary"
            @click="createUser"
            :loading="creating"
            :disabled="!createFormValid"
            class="px-6"
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
          <v-icon size="28" color="warning" class="me-3">mdi-account-edit</v-icon>
          編輯使用者
        </v-card-title>
        <v-card-text class="pa-6 pt-0" v-if="editingUser">
          <v-form ref="editForm" v-model="editFormValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editingUser.account"
                  label="帳號"
                  variant="outlined"
                  density="comfortable"
                  :rules="[rules.required, rules.account]"
                  prepend-inner-icon="mdi-account"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editingUser.email"
                  label="電子郵件"
                  variant="outlined"
                  density="comfortable"
                  :rules="[rules.required, rules.email]"
                  prepend-inner-icon="mdi-email"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="editingUser.role"
                  label="角色"
                  :items="roleOptions"
                  variant="outlined"
                  density="comfortable"
                  :rules="[rules.required]"
                  prepend-inner-icon="mdi-shield"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editingUser.password"
                  label="新密碼 (留空則不修改)"
                  type="password"
                  variant="outlined"
                  density="comfortable"
                  :rules="[rules.password]"
                  prepend-inner-icon="mdi-lock"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn
            color="grey"
            variant="outlined"
            @click="editDialog = false"
            class="px-6"
          >
            取消
          </v-btn>
          <v-btn
            color="primary"
            @click="saveUser"
            :loading="saving"
            :disabled="!editFormValid"
            class="px-6"
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
          <v-icon size="32" color="error" class="me-3">mdi-alert-circle</v-icon>
          確認刪除
        </v-card-title>
        <v-card-text class="pa-6 pt-0 text-center">
          <p class="text-body-1 mb-4">
            確定要刪除使用者 <strong class="text-error">{{ userToDelete?.account }}</strong> 嗎？
          </p>
          <p class="text-body-2 text-medium-emphasis">
            此操作無法復原，請謹慎操作。
          </p>
        </v-card-text>
        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn
            color="grey"
            variant="outlined"
            @click="deleteDialog = false"
            class="px-6"
          >
            取消
          </v-btn>
          <v-btn
            color="error"
            @click="deleteUser"
            :loading="deleting"
            class="px-6"
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
      :timeout="3000"
      location="top"
    >
      <div class="d-flex align-center">
        <v-icon class="me-3">
          {{ snackbar.color === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle' }}
        </v-icon>
        {{ snackbar.message }}
      </div>
    </v-snackbar>
  </v-container>
</template>

<script>
import userService from '@/services/user'

export default {
  name: 'AdminUsers',
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
      newUser: {
        account: '',
        email: '',
        password: '',
        role: 'user'
      },
      snackbar: {
        show: false,
        message: '',
        color: 'success'
      },
      headers: [
        { title: '帳號', key: 'account', sortable: true, width: '300px' },
        { title: '電子郵件', key: 'email', sortable: true },
        { title: '角色', key: 'role', sortable: true, width: '150px' },
        { title: '建立時間', key: 'createdAt', sortable: true, width: '200px' },
        { title: '操作', key: 'actions', sortable: false, width: '150px' }
      ],
      roleOptions: [
        { title: '一般使用者', value: 'user' },
        { title: '管理員', value: 'admin' }
      ],
      rules: {
        required: v => !!v || '此欄位為必填',
        account: v => /^[a-zA-Z0-9]{4,20}$/.test(v) || '帳號只能包含英文字母和數字，長度4-20字元',
        email: v => /.+@.+\..+/.test(v) || '請輸入有效的電子郵件地址',
        password: v => !v || v.length >= 4 && v.length <= 20 || '密碼長度必須在4-20字元之間'
      }
    }
  },
  computed: {
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
    }
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
    },
    resetNewUser () {
      this.newUser = {
        account: '',
        email: '',
        password: '',
        role: 'user'
      }
      if (this.$refs.createForm) {
        this.$refs.createForm.resetValidation()
      }
    },
    async createUser () {
      if (!this.$refs.createForm.validate()) return

      this.creating = true
      try {
        const response = await userService.createUser(this.newUser)

        // 新增到本地列表
        this.users.unshift(response.data.result)

        this.closeCreateDialog()
        this.showSnackbar('使用者建立成功', 'success')
      } catch (error) {
        console.error('建立使用者失敗:', error)
        this.showSnackbar(error.response?.data?.message || '建立使用者失敗', 'error')
      } finally {
        this.creating = false
      }
    },
    editUser (user) {
      this.editingUser = {
        ...user,
        password: '' // 清空密碼欄位
      }
      this.editDialog = true
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
        const index = this.users.findIndex(u => u._id === this.editingUser._id)
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
        this.showSnackbar(error.response?.data?.message || '更新使用者失敗', 'error')
      } finally {
        this.saving = false
      }
    },
    confirmDelete (user) {
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
        this.showSnackbar(error.response?.data?.message || '刪除使用者失敗', 'error')
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
        minute: '2-digit'
      })
    },
    showSnackbar (message, color = 'success') {
      this.snackbar = {
        show: true,
        message,
        color
      }
    }
  }
}
</script>

<style scoped>
.v-data-table {
  border-radius: 8px;
}

.v-card {
  border-radius: 12px;
}

.v-btn {
  border-radius: 8px;
}

/* .v-text-field, .v-select {
  border-radius: 8px;
} */

/* .gap-2 {
  gap: 8px;
} */

 /* 確保所有元素都使用米色背景 */
:deep(.v-data-table) {
  background-color: #fffef5ff !important;
}

:deep(.v-data-table__wrapper) {
  background-color: #fffef5ff !important;
}

:deep(.v-data-table__td) {
  background-color: #fffef5ff !important;
}

:deep(.v-data-table__th) {
  background-color: #fffef5ff !important;
}

:deep(.v-field) {
  background-color: #fffef5ff !important;
}

:deep(.v-field__input) {
  background-color: #fffef5ff !important;
}

:deep(.v-list) {
  background-color: #fffef5ff !important;
}

:deep(.v-list-item) {
  background-color: #fffef5ff !important;
}
</style>

<route lang="yaml">
  meta:
    layout: 'admin'
    title: '使用者管理'
    login: 'login-only'
    admin: true
</route>
