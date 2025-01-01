<template>
    <div class="chat-area">
        <t-chat
            ref="chatRef"
            layout="single"
            style="height: 600px"
            :reverse="true"
            :clear-history="chatList.length > 0 && !isStreamLoad"
            @clear="clearConfirm"
        >
            <template v-for="(item, index) in chatList" :key="index" id="chat-area">
                <t-chat-item
                    :id="index"
                    :avatar="chatShowOptions.showAvatar && item.avatar"
                    :name="chatShowOptions.showName && item.name"
                    :role="item.role"
                    :datetime="chatShowOptions.showDateTime && item.datetime"
                    :content="item.content"
                    :variant="textStyle"
                    :text-loading="index === 0 && loading"
                >
                    <template v-if="!isStreamLoad" #actions>
                        <t-chat-action
                            :is-good="isGood"
                            :is-bad="isBad"
                            :content="item.content"
                            @operation="(type, { e }) => handleOperation(type, { e, index })"
                        />
                    </template>
                </t-chat-item>
            </template>
            <template #footer>
                <div class="footer-area">
                    <div class="footer-area-items">
                        <t-chat-input
                            :stop-disabled="isStreamLoad"
                            @send="inputEnter"
                            @stop="onStop"
                        ></t-chat-input>
                        <div class="footer-btn">
                            <t-button
                                variant="outline"
                                shape="round"
                                @click="() => handleClick('theme')"
                            >
                                样式设置
                            </t-button>
                            <t-button
                                variant="outline"
                                shape="round"
                                @click="() => handleClick('history')"
                            >
                                查看历史
                            </t-button>
                        </div>
                    </div>
                </div>
            </template>
        </t-chat>

        <t-drawer
            :visible.sync="visible['history']"
            header="问答历史"
            :closeBtn="true"
            :showOverlay="true"
            :preventScrollThrough="false"
            :footer="false"
            @close="() => handleClose('history')"
        >
            <t-anchor container="#chat-area" class="reverseFlex">
                <template v-for="(item, index) in chatList" :key="index">
                    <t-anchor-item
                        v-if="item.role === 'user'"
                        :href="'#' + index"
                        :title="item.content"
                    />
                </template>
            </t-anchor>
        </t-drawer>

        <t-drawer
            :visible.sync="visible['theme']"
            header="样式设置"
            :closeBtn="true"
            :showOverlay="true"
            :preventScrollThrough="false"
            :footer="false"
            @close="() => handleClose('theme')"
        >
            <ThemeSettings />
        </t-drawer>
    </div>
</template>
<script setup>
import { computed, ref } from 'vue'
import ThemeSettings from './components/ThemeSettings.vue'
import { useStore } from 'vuex'

const store = useStore()
const fetchCancel = ref(null)
const loading = ref(false)
const isStreamLoad = ref(false)
const isGood = ref(false)
const isBad = ref(false)
const chatRef = ref(null)

const defaultVisible = { theme: false, history: false }
const visible = ref(defaultVisible)
const handleClick = (param) => {
    visible.value = {
        ...defaultVisible,
        ...{
            [param]: !visible.value[param],
        },
    }
}
const handleClose = (param) => {
    visible.value[param] = false
}

const chatShowOptions = computed(() => store.state.theme.chatShowOptions)
const textStyle = computed(() => store.state.theme.textStyle)

// 滚动到底部
const backBottom = () => {
    chatRef.value.scrollToBottom({
        behavior: 'smooth',
    })
}
// 倒序渲染
const chatList = ref([
    {
        content: `模型由 <span>hunyuan</span> 变为 <span>GPT4</span>`,
        role: 'model-change',
    },
    {
        avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
        name: 'TD&AI',
        datetime: '今天16:38',
        content:
            '它叫 McMurdo Station ATM，是美国富国银行安装在南极洲最大科学中心麦克默多站的一台自动提款机。',
        role: 'assistant',
    },
    {
        avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
        name: '自己',
        datetime: '今天16:38',
        content: '南极的自动提款机叫什么名字？',
        role: 'user',
    },
])
// 清空历史记录
const clearConfirm = function () {
    chatList.value = []
}
const onStop = function () {
    if (fetchCancel.value) {
        fetchCancel.value.abort()
        loading.value = false
        isStreamLoad.value = false
    }
}
const handleOperation = function (type, options) {
    const { index } = options
    if (type === 'good') {
        isGood.value = !isGood.value
        isBad.value = false
    } else if (type === 'bad') {
        isBad.value = !isBad.value
        isGood.value = false
    } else if (type === 'replay') {
        const userQuery = chatList.value[index + 1].content
        inputEnter(userQuery)
    }
}
const handleData = async (inputValue) => {
    loading.value = true
    isStreamLoad.value = true
    const lastItem = chatList.value[0]
    const messages = [
        {
            role: 'user',
            content: inputValue,
        },
    ]
    fetchSSE(messages, {
        success(result) {
            loading.value = false
            const { data } = result
            lastItem.content += data?.delta?.content
        },
        complete(isOk, msg) {
            if (!isOk || !lastItem.content) {
                lastItem.role = 'error'
                lastItem.content = msg
            }
            // 控制终止按钮
            isStreamLoad.value = false
            loading.value = false
        },
        cancel(cancel) {
            fetchCancel.value = cancel
        },
    })
}
const inputEnter = function (inputValue) {
    if (isStreamLoad.value) {
        return
    }
    if (!inputValue) return
    const params = {
        avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
        name: '自己',
        datetime: new Date().toDateString(),
        content: inputValue,
        role: 'user',
    }
    chatList.value.unshift(params)
    // 空消息占位
    const params2 = {
        avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
        name: 'TD&AI',
        datetime: new Date().toDateString(),
        content: '',
        role: 'assistant',
    }
    chatList.value.unshift(params2)
    handleData(inputValue)
}
// 解析SSE数据
const fetchSSE = async (messages, options) => {
    const { success, fail, complete, cancel } = options
    const controller = new AbortController()
    const { signal } = controller
    cancel?.(controller)
    // your-api-key
    const apiKey = import.meta.env.VITE_VUE_APP_API_KEY
    const responsePromise = fetch('/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer${apiKey ? ` ${apiKey}` : ''}`,
        },
        body: JSON.stringify({
            messages, // 消息列表
            model: 'hunyuan-pro', // 模型
            stream: true, // 流式
        }),
        signal,
    }).catch((e) => {
        const msg = e.toString() || '流式接口异常'
        complete?.(false, msg)
        return Promise.reject(e) // 确保错误能够被后续的.catch()捕获
    })

    responsePromise
        .then((response) => {
            if (!response?.ok) {
                complete?.(false, response.statusText)
                fail?.()
                throw new Error('Request failed') // 抛出错误以便链式调用中的下一个.catch()处理
            }
            const reader = response.body.getReader()
            const decoder = new TextDecoder()
            if (!reader) throw new Error('No reader available')

            const bufferArr = []
            let dataText = '' // 记录数据
            const event = { type: null, data: null }

            async function processText({ done, value }) {
                if (done) {
                    complete?.(true)
                    return Promise.resolve()
                }
                const chunk = decoder.decode(value)
                const buffers = chunk.toString().split(/\r?\n/)
                bufferArr.push(...buffers)
                const i = 0
                while (i < bufferArr.length) {
                    const line = bufferArr[i]
                    if (line) {
                        dataText += line
                        const response = line.slice(6)
                        if (response === '[DONE]') {
                            event.type = 'finish'
                            dataText = ''
                        } else {
                            const choices = JSON.parse(response.trim())?.choices?.[0]
                            if (choices.finish_reason === 'stop') {
                                event.type = 'finish'
                                dataText = ''
                            } else {
                                event.type = 'delta'
                                event.data = choices
                            }
                        }
                    }
                    if (event.type && event.data) {
                        const jsonData = JSON.parse(JSON.stringify(event))
                        // debugger;
                        success(jsonData)
                        event.type = null
                        event.data = null
                    }
                    bufferArr.splice(i, 1)
                }
                return reader.read().then(processText)
            }

            return reader.read().then(processText)
        })
        .catch(() => {
            // 处理整个链式调用过程中发生的任何错误
            fail?.()
        })
}
</script>

<style lang="less" scoped>
.chat-area {
    display: flex;
    :global(.t-chat) {
        height: 95vh !important;
    }
    :global(.t-drawer__mask) {
        opacity: 0 !important;
    }
}

.reverseFlex {
    display: flex;
    flex-direction: column-reverse;
}

.footer-area {
    display: flex;
    justify-content: center;
    &-items {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        flex-direction: column;
        gap: 1rem;
        width: 60vw;
    }
}

.footer-btn {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
}
</style>
