<template>
  <q-page class="q-py-md">
    <div class="row justify-center">
      <div class="col-12 text-center">
        <span class="text-bold">Histori Pinjaman dan Setoran</span>
      </div>
      <div class="col-12">
        <span class="q-px-md">Peminjam : {{ peminjam }}</span>
      </div>
      <div class="col-12 q-mb-md">
        <span class="q-px-md">Alamat : {{ alamat }}</span>
      </div>
      <div class="q-gutter-md">
        <q-card
          v-for="(data, index) in dataHistory.detail"
          :key="`hKontrak` + index"
          class="my-card"
        >
          <q-card-section>
            <div class="row">
              <div class="q-px-sm full-width">
                No. Kontrak : {{ data.BuktiTKontrak.value }}
              </div>
              <div class="q-px-sm full-width">
                Tanggal :
                <span class="text-right">{{
                  getFormatedData(data.TglTKontrak.value, "date")
                }}</span>
              </div>
              <div class="q-px-sm full-width">
                Nilai Awal Pinjaman :
                {{ getFormatedData(data.NilaiPinjaman.value, "number") }}
              </div>
            </div>
          </q-card-section>
          <q-markup-table dense separator="cell">
            <thead>
              <tr class="bg-grey-6">
                <th class="text-center">Tgl</th>
                <th class="text-center">Keterangan</th>
                <th class="text-center">Bunga(%)</th>
                <th class="text-center">Nilai</th>
                <th class="text-center">Pinjaman</th>
                <th class="text-center">Bunga</th>
                <th class="text-center">Simpanan</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(data2, index2) in data.DoD"
                :key="`tr ${index}${index2}`"
              >
                <th class="text-center">
                  {{ getFormatedData(data2.TglTrans.value, "date") }}
                </th>
                <th class="text-center">{{ data2.Keterangan.value }}</th>
                <th class="text-center">
                  {{ getFormatedData(data2.BungaP.value, "number") }}%
                </th>
                <th class="text-center">
                  {{ getFormatedData(data2.Nilai.value, "number") }}
                </th>
                <th class="text-center">
                  {{ getFormatedData(data2.SisaPinjaman.value, "number") }}
                </th>
                <th class="text-center">
                  {{ getFormatedData(data2.BungaV.value, "number") }}
                </th>
                <th class="text-center">
                  {{ getFormatedData(data2.Simpanan.value, "number") }}
                </th>
              </tr>
            </tbody>
            <tfoot>
              <tr class="bg-grey-6">
                <th colspan="5">Total :</th>
                <th>{{ totalBunga(index) }}</th>
                <th></th>
              </tr>
            </tfoot>
          </q-markup-table>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
<style scoped>
.my-card {
  width: 100vw;
}
</style>
<script src="./HistoryKontrakPage.js"></script>
