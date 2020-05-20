<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-table
        title="Project"
        :data="data"
        :columns="columns"
        row-key="ID"
        :pagination.sync="pagination"
        :loading="loading"
        :filter="filter"
        @request="loadData"
        binary-state-sort
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th v-for="col in props.cols" :key="'' + col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <div
                :style="
                  col.label == 'Fitur' || col.label == 'Modul'
                    ? 'width:200px;white-space: normal'
                    : ''
                "
              >
                {{ col.value }}
              </div>
            </q-td>
          </q-tr>
        </template>
        <template v-slot:top>
          <q-btn
            color="primary"
            icon-right="archive"
            label="Export to Excel"
            no-caps
            @click="exportExcel(columns, data, 'data-plan')"
          />
          <div class="row full-width">
            <div class="col-6">
              <q-select
                v-model="filter.Project"
                use-input
                hide-selected
                input-debounce="0"
                label="Pilih Project"
                :options="projectFiltered"
                @filter="filterSelectProject"
                style="width: 250px"
                behavior="menu"
                fill-input
                map-options
                class="q-pl-md full-width"
              >
                <template v-slot:append>
                  <q-icon
                    name="close"
                    @click.prevent="filter.Project = { label: '', value: '' }"
                    class="cursor-pointer"
                  />
                </template>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Tidak ada data
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="col-6">
              <q-select
                v-model="filter.Jenis"
                use-input
                hide-selected
                input-debounce="0"
                label="Pilih Jenis"
                :options="jenisFiltered"
                @filter="filterSelectJenis"
                style="width: 250px"
                behavior="menu"
                fill-input
                map-options
                class="q-pl-md full-width"
              >
                <template v-slot:append>
                  <q-icon
                    name="close"
                    @click.prevent="filter.Jenis = { label: '', value: '' }"
                    class="cursor-pointer"
                  />
                </template>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Tidak ada data
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="col-6">
              <q-select
                v-model="filter.Programmer"
                use-input
                hide-selected
                input-debounce="0"
                label="Pilih Programmer"
                :options="internalFiltered"
                @filter="filterSelectInternal"
                style="width: 250px"
                behavior="menu"
                fill-input
                map-options
                class="q-pl-md full-width"
              >
                <template v-slot:append>
                  <q-icon
                    name="close"
                    @click.prevent="
                      filter.Programmer = { label: '', value: '' }
                    "
                    class="cursor-pointer"
                  />
                </template>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Tidak ada data
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="col-6">
              <q-input
                v-model="filter.TglPlan"
                class="q-pl-md full-width"
                label="Tgl Pengerjaan"
                mask="date"
                @click="$refs.qDateProxy.show()"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxy"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="filter.TglPlan"
                        @input="() => $refs.qDateProxy.hide()"
                      />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script src="./HistoryPiutang.js"></script>
