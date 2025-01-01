<template>
    <t-space direction="vertical">
        <h3>聊天显示设置</h3>
        <div
            class="tdesign-demo-block-row"
            v-for="(option, index) in chatShowOptionConstants"
            :key="index"
        >
            <span>{{ option.label }}</span>
            <t-switch
                size="large"
                v-model="chatShowOptions[option.param]"
                :label="['开', '关']"
                @change="onChangeChatShows"
            ></t-switch>
        </div>
        <h3>文本样式</h3>
        <t-radio-group
            v-model="textStyle"
            :options="textStyleOptions"
            @change="onChangeTextStyle"
        />
    </t-space>
</template>

<script setup>
import { useStore } from 'vuex'
import { ref } from 'vue'

const chatShowOptionConstants = [
    { param: 'showAvatar', label: '头像' },
    { param: 'showName', label: '名字' },
    { param: 'showDateTime', label: '时间' },
]

const textStyle = ref('text')
const textStyleOptions = ref([
    {
        value: 'text',
        label: '无',
        allowUncheck: true,
    },
    {
        value: 'outline',
        label: '边框',
    },
    {
        value: 'base',
        label: '阴影',
    },
])

const store = useStore()

const chatShowOptions = ref(store.state.theme.chatShowOptions)

const onChangeChatShows = () => {
    store.dispatch('theme/changeChatShowOptions', chatShowOptions.value)
}

const onChangeTextStyle = (checkedTextStyle) => {
    textStyle.value = checkedTextStyle
    store.dispatch('theme/changeTextStyle', checkedTextStyle)
}
</script>

<style scoped lang="less"></style>
