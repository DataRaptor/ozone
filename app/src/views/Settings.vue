<template>
  <div class="d-flex">
    <h5 class="h5">Settings</h5>
  </div>

  <v-tabs v-model="state.tab" class="my-5">
    <v-tab :value="0" color="primary">Account</v-tab>
    <v-tab :value="1" color="primary">Company</v-tab>
    <v-tab :value="2" color="primary">Security</v-tab>
  </v-tabs>

  <loader v-if="state.loading" />
  <template v-else>
    <v-row>
      <v-col cols="12" md="6">
        <v-window v-model="state.tab">
          <v-window-item :value="0">
            <div class="mb-3">
              <p>Update your personal details.</p>
            </div>

            <div>
              <v-label class="mb-2">Full Name</v-label>
              <v-text-field
                v-model="state.input.user.name"
                placeholder="Enter Full Name"
                variant="outlined"
                density="compact"
                color="primary"
              />
            </div>

            <div>
              <v-label class="mb-2">Email</v-label>
              <v-text-field
                v-model="state.input.user.email"
                placeholder="Enter Email"
                variant="outlined"
                density="compact"
                color="primary"
              />
            </div>

            <div>
              <v-label class="mb-2">Wallet Address</v-label>
              <v-text-field
                v-model="state.input.user.address"
                placeholder="Wallet Address"
                variant="outlined"
                density="compact"
                color="primary"
                disabled
              />
            </div>

            <v-btn flat color="primary" @click="updateUser">Update</v-btn>
          </v-window-item>

          <v-window-item :value="1">
            <div class="mb-3">
              <p>Your company details will be included and visible in your invoices, payment requests and others.</p>
            </div>

            <div>
              <v-label class="mb-2">Name</v-label>
              <v-text-field
                v-model="state.input.company.name"
                placeholder="Enter Name"
                variant="outlined"
                density="compact"
                color="primary"
              />
            </div>

            <div>
              <v-label class="mb-2">Email</v-label>
              <v-text-field
                v-model="state.input.company.email"
                placeholder="Enter Email"
                variant="outlined"
                density="compact"
                color="primary"
              />
            </div>

            <div>
              <v-label class="mb-2">Phone</v-label>
              <v-text-field
                v-model="state.input.company.phone"
                placeholder="Enter Phone"
                variant="outlined"
                density="compact"
                color="primary"
              />
            </div>

            <div>
              <v-label class="mb-2">Tax Number</v-label>
              <v-text-field
                v-model="state.input.company.taxNumber"
                placeholder="Enter Tax Number"
                variant="outlined"
                density="compact"
                color="primary"
              />
            </div>

            <v-row>
              <v-col cols="12" md="6">
                <div>
                  <v-label class="mb-2">City</v-label>
                  <v-text-field
                    v-model="state.input.company.city"
                    placeholder="Enter City"
                    variant="outlined"
                    density="compact"
                    color="primary"
                  />
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div>
                  <v-label class="mb-2">Postal Code</v-label>
                  <v-text-field
                    v-model="state.input.company.postalCode"
                    placeholder="Enter Postal Code"
                    variant="outlined"
                    density="compact"
                    color="primary"
                  />
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div>
                  <v-label class="mb-2">State</v-label>
                  <v-text-field
                    v-model="state.input.company.state"
                    placeholder="Enter State"
                    variant="outlined"
                    density="compact"
                    color="primary"
                  />
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div>
                  <v-label class="mb-2">Country</v-label>
                  <v-select
                    v-model="state.input.company.country"
                    :items="state.countries"
                    item-value="code"
                    item-title="name"
                    variant="outlined"
                    density="compact"
                    color="primary"
                  />
                </div>
              </v-col>
            </v-row>
            <div class="mb-3">
              <v-btn flat color="primary" @click="updateCompany">Update</v-btn>
            </div>
          </v-window-item>

          <v-window-item :value="2">
            <div class="mb-3">
              <p>Update your security details.</p>
            </div>

            <template v-if="user.hasPassword">
              <div>
                <v-label class="mb-2">Old Password</v-label>
                <v-text-field
                  v-model="state.input.security.oldPassword"
                  type="password"
                  variant="outlined"
                  placeholder="Enter Old Password"
                  density="compact"
                  color="primary"
                />
              </div>

              <div>
                <v-label class="mb-2">New Password</v-label>
                <v-text-field
                  v-model="state.input.security.newPassword"
                  type="password"
                  variant="outlined"
                  placeholder="Enter New Password"
                  density="compact"
                  color="primary"
                />
              </div>
            </template>
            <template v-else>
              <div>
                <v-label class="mb-2">New Password</v-label>
                <v-text-field
                  v-model="state.input.security.newPassword"
                  type="password"
                  variant="outlined"
                  placeholder="Enter Old Password"
                  density="compact"
                  color="primary"
                />
              </div>

              <div>
                <v-label class="mb-2">Repeat Password</v-label>
                <v-text-field
                  v-model="state.input.security.repeatPassword"
                  type="password"
                  variant="outlined"
                  placeholder="Repeat New Password"
                  density="compact"
                  color="primary"
                />
              </div>
            </template>

            <v-btn flat color="primary" @click="updateUserPassword">Update</v-btn>
          </v-window-item>
        </v-window>
      </v-col>
    </v-row>
  </template>
</template>

<script>
import { storeToRefs } from "pinia";
import { onMounted, reactive, watch } from "vue";
import Loader from "../components/Loader.vue";
import { countries } from "../config/countries";
import { userService, companyService } from "../services";
import { useAuthStore, useCompanyStore } from "../stores";
import { toast } from "../utils";

export default {
  components: { Loader },
  setup() {
    const state = reactive({ loading: false, tab: null, countries, input: { user: {}, company: {}, security: {} } });
    const { user } = storeToRefs(useAuthStore());
    const { company } = storeToRefs(useCompanyStore());

    onMounted(async () => {
      state.input.user = { ...user.value };
      state.input.company = { ...company.value };
    });

    watch(
      () => user.value,
      () => {
        state.input.user = { ...user.value };
      }
    );

    watch(
      () => company.value,
      () => {
        state.input.company = { ...company.value };
      }
    );

    async function updateCompany() {
      try {
        await companyService.updateCompany(company.value.id, state.input.company);
      } catch (e) {
        toast.error(e.message);
      }
    }

    async function updateUser() {
      try {
        await userService.updateUser(state.input.user);
      } catch (e) {
        toast.error(e.message);
      }
    }

    async function updateUserPassword() {
      try {
        await userService.updateUserPassword(state.input.security);
      } catch (e) {
        toast.error(e.message);
      }
    }

    return { user, state, updateCompany, updateUser, updateUserPassword };
  },
};
</script>

<style scoped>
.v-tab {
  justify-content: start;
}
</style>
