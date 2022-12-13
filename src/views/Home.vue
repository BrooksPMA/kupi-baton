<template>
  <div class="main__goods pb-5">
    <div class="pt-5 title has-text-centered">Купи батон 🥖</div>
    <form class="form" @submit.prevent="addGood">
      <div class="field has-addons mb-5 mx-1">
        <p class="control is-expanded">
          <input
            class="input is-large"
            type="text"
            placeholder="Название товара"
            v-model="goodContent"
          />
        </p>
        <p class="control">
          <button class="button is-info is-large" :disabled="!goodContent">
            🥖
          </button>
        </p>
      </div>
    </form>

    <div
      v-for="good in goods"
      :key="good.id"
      class="card mb-3 mx-1"
      :class="{ 'has-background-success-light': good.done }"
    >
      <div class="card-content">
        <div class="content">
          <div class="columns is-mobile is-vcentered">
            <div
              class="column has-text-centered is-size-3"
              :class="{ 'has-text-success line-through': good.done }"
              @click="toggleGood(good.id)"
            >
              {{ good.name }}
            </div>
            <div class="column is-5 has-text-right">
              <button
                class="button is-danger ml-2"
                @click="deleteGood(good.id)"
              >
                &cross;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="field has-addons mt-2 mb-1 mx-1">
      <p class="control is-expanded">
        <input
          class="input is-medium"
          type="text"
          v-model="link"
          v-on:focus="$event.target.select()"
          ref="linkRef"
          readonly
        />
      </p>
      <p class="control">
        <button class="button is-info is-medium" @click="copyLink">🔗</button>
      </p>
    </div>
    <div class="button__container">
      <button
        v-if="hasGoods"
        class="button is-danger is-size-3 is-fullwidth delall"
        @click="deleteAllGoods"
      >
        Удалить все
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { db } from '../firebase/index';
import { useRoute } from 'vue-router';
import {
  collection,
  onSnapshot,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
} from 'firebase/firestore';

const hasGoods = computed(() => {
  return goods.value.length;
});

const route = useRoute();
const dbName = route.params.slug;

const goodsCollection = collection(db, dbName);
const goodsCollectionQuery = query(goodsCollection, orderBy('date', 'desc'));

onMounted(() => {
  onSnapshot(goodsCollectionQuery, (querySnapshot) => {
    const fbGoods = [];
    querySnapshot.forEach((doc) => {
      const good = {
        id: doc.id,
        name: doc.data().name,
        done: doc.data().done,
      };
      fbGoods.push(good);
    });
    goods.value = fbGoods;
  });
});

const link = window.location.href;
const linkRef = ref(null);

const copyLink = () => {
  linkRef.value.focus();
  document.execCommand('copy');
};

const goods = ref([]);
const goodContent = ref('');

const addGood = () => {
  addDoc(goodsCollection, {
    name: goodContent.value,
    done: false,
    date: Date.now(),
  });
  goodContent.value = '';
};

const deleteGood = (id) => {
  deleteDoc(doc(goodsCollection, id));
};

const toggleGood = (id) => {
  const index = goods.value.findIndex((good) => good.id === id);
  updateDoc(doc(goodsCollection, id), {
    done: !goods.value[index].done,
  });
};

const deleteAllGoods = () => {
  const confirmDelete = confirm('Вы уверены что хотите удалить все товары?');
  if (confirmDelete) {
    goods.value.forEach((good) => {
      deleteGood(good.id);
    });
  }
};
</script>

<style>
@import 'bulma/css/bulma.min.css';

.main__goods {
  max-width: 350px;
  margin: auto;
}

.button__container {
  margin-right: 4px;
  margin-left: 4px;
}

.line-through {
  text-decoration: line-through;
}
</style>
