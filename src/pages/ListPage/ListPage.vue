<template>
  <q-page>
    <q-table
      class="my-sticky-column-table"
      :data="dataToShow"
      :columns="columns"
      row-key="idtcostingmarketing"
    >
      <!-- form filter -->
      <template v-slot:top>
        <q-expansion-item
          expand-separator
          icon="search"
          label="Filters"
          class="full-width"
        >
          <div class="row full-width">
            <div
              v-for="(data, index) in filters"
              :key="`filter${index}`"
              class="col-6"
            >
              <q-input
                v-if="
                  data.type.toLowerCase().toLowerCase() == 'text' ||
                    data.type.toLowerCase().toLowerCase() == 'number'
                "
                borderless
                dense
                debounce="300"
                v-model="data.value"
                :placeholder="data.label"
                ><template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
              <q-input
                v-else-if="data.type.toLowerCase().toLowerCase() == 'date'"
                borderless
                dense
                @click.self="showDatePicker(`date${data.key}`, data.key)"
                debounce="300"
                readonly
                v-model="data.value"
                :placeholder="data.label"
                mask="##/##/####"
                ><template v-slot:append>
                  <q-icon v-if="!data.value" name="search" />
                  <q-icon
                    v-else
                    name="clear"
                    @click.stop="clearTgl(`${data.key}`, index)"
                  />
                  <q-popup-proxy
                    :ref="`date${data.key}`"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="data.value"
                      mask="DD/MM/YYYY"
                      @input="() => $refs[`date${data.key}`][0].hide()"
                    />
                  </q-popup-proxy>
                </template>
              </q-input>
              <q-input
                v-else-if="data.type.toLowerCase() == 'time'"
                borderless
                dense
                @click.self="showTimePicker(`time${data.key}`, data.key)"
                debounce="300"
                readonly
                v-model="data.value"
                :placeholder="data.label"
                mask="##:##:##"
                ><template v-slot:append>
                  <q-icon v-if="!data.value" name="search" />
                  <q-icon
                    v-else
                    name="clear"
                    @click.stop="clearTime(`${data.key}`, index)"
                  />
                  <q-popup-proxy
                    :ref="`time${data.key}`"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-time
                      v-model="data.value"
                      mask="HH:mm:ss"
                      with-seconds
                      format24h
                    />
                  </q-popup-proxy>
                </template>
              </q-input>
              <q-input
                v-else-if="data.type.toLowerCase() == 'datetime'"
                borderless
                dense
                @click.self="
                  showDatetimePicker(`datetime${data.key}`, data.key)
                "
                debounce="300"
                readonly
                v-model="data.value"
                :placeholder="data.label"
                mask="##/##/#### ##:##:##"
                ><template v-slot:append>
                  <q-icon v-if="!data.value" name="search" />
                  <q-icon
                    v-else
                    name="clear"
                    @click.stop="clearDatetime(`${data.key}`, index)"
                  />
                  <q-popup-proxy
                    :ref="`datetime${data.key}`"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-card>
                      <q-tabs
                        v-model="datetimeTab"
                        dense
                        class="text-grey"
                        active-color="primary"
                        indicator-color="primary"
                        align="justify"
                        narrow-indicator
                      >
                        <q-tab name="Date" label="Date" />
                        <q-tab name="Time" label="Time" />
                      </q-tabs>
                      <q-separator />

                      <q-tab-panels v-model="datetimeTab" animated>
                        <q-tab-panel name="Date">
                          <div class="text-center">{{ data.value }}</div>
                          <q-date
                            v-model="data.value"
                            mask="DD/MM/YYYY HH:mm:ss"
                          />
                        </q-tab-panel>

                        <q-tab-panel name="Time">
                          <div class="text-center">{{ data.value }}</div>
                          <q-time
                            v-model="data.value"
                            mask="DD-MM-YYYY HH:mm:ss"
                            with-seconds
                            format24h
                          />
                        </q-tab-panel>
                      </q-tab-panels>
                    </q-card>
                  </q-popup-proxy>
                </template>
              </q-input>
            </div>
            <q-select
              v-model="statusSelected"
              label="Status"
              :options="statusOptions"
              style="width: 250px"
              map-options
              class="q-pl-md full-width"
            >
            </q-select>
          </div>
        </q-expansion-item>
      </template>
      <!-- end form filter -->
      <template v-slot:body="props">
        <q-tr :props="props" :ref="'qTr' + props.row.ID">
          <template>
            <q-td
              v-for="(data, index) in columns"
              :style="index == 0 ? getBgTheme : ''"
              :key="data.name"
              :props="props"
            >
              <template v-if="index != 1">
                {{
                  getFormatedData(
                    props.row.data.master[columns[index].name].value,
                    columns[index].type
                  )
                }}
              </template>
              <!-- <template v-if="index == 0">
                <q-btn
                  dense
                  round
                  flat
                  :icon="props.expand ? 'arrow_drop_up' : 'arrow_drop_down'"
                  @click="expand(props.row.ID)"
                />
              </template> -->
              <template v-if="index == 1">
                <q-btn
                  round
                  class="text-oren-winaros"
                  :ripple="{ center: true }"
                  icon="remove_red_eye"
                  :to="`${$route.path}/` + props.row.ID"
                />
              </template>
            </q-td>
          </template>
        </q-tr>
        <!-- <q-tr class="zem-expand-tb" v-show="props.expand" :props="props">
          <q-td :class="$q.screen.lt.md ? 'zem-width-full' : ''">
            <div class="row justify-center">
              <div class="col-12 text-center">
                <span class="text-h6">
                  {{ getStatusString(dataConsume[0].status) }}
                </span>
              </div>
            </div>
          </q-td>
        </q-tr> -->
      </template>
    </q-table>
  </q-page>
</template>
<script src="./ListPage.js"></script>

<style lang="stylus">
theme-background = var(--theme-background, '200px');
.bg-primary-darkened
  //background $primary-darkened !important
  background var(--q-color-primary) !important
.my-sticky-column-table {
  /*
    specifying max-width so the example can
    highlight the sticky column on any browser window
  */
  max-width: 100vw;

  /* bg color is important for th; just specify one */
  thead tr:first-child th:first-child {
    background-color: #fff;
    opacity: 1;
  }

  td:first-child {
    color: white;
  }

  thead tr:first-child th:first-child, td:first-child {
    position: sticky;
    left: 0;
    z-index: 1;
  }
}

.zem-expand-tb {
  td:first-child {
    background-color: white;
    color: black;
  }
}

.zem-width-full {
  min-width: 100vw;
}
</style>
