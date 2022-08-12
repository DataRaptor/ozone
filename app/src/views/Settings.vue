<template>
  <div class="d-flex">
    <h5 class="h5">Settings</h5>
  </div>

  <v-tabs v-model="state.tab" class="my-5">
    <v-tab density="compact" :value="0" color="primary">Account</v-tab>
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

            <v-btn flat color="primary">Update</v-btn>
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
                  <v-text-field
                    v-model="state.input.company.country"
                    placeholder="Enter Country"
                    variant="outlined"
                    density="compact"
                    color="primary"
                  />
                </div>
              </v-col>
            </v-row>
            <div class="mb-3">
              <v-btn flat color="primary">Update</v-btn>
            </div>
          </v-window-item>

          <v-window-item :value="2">
            <div class="mb-3">
              <p>Update your security details.</p>
            </div>

            <div>
              <v-label class="mb-2">Old Password</v-label>
              <v-text-field variant="outlined" placeholder="Enter Old Password" density="compact" color="primary" />
            </div>

            <div>
              <v-label class="mb-2">New Password</v-label>
              <v-text-field variant="outlined" placeholder="Enter New Password" density="compact" color="primary" />
            </div>

            <v-btn flat color="primary">Update</v-btn>
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
import { authService } from "../services";
import { useAuthStore, useCompanyStore } from "../stores";
import { toast } from "../utils";

export default {
  components: { Loader },
  setup() {
    const state = reactive({ loading: false, tab: null, input: { user: {}, company: {}, security: {} } });
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

    return { state };
  },
};
</script>
