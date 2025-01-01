import { mount } from '@vue/test-utils'
import Demo from './demo.vue'
import { createStore } from 'vuex'

describe('Demo.vue', () => {
    let wrapper
    let store

    beforeEach(() => {
        store = createStore({
            state: {
                theme: {
                    chatShowOptions: {
                        showAvatar: true,
                        showName: true,
                        showDateTime: true,
                    },
                    textStyle: 'default',
                },
            },
            mutations: {},
        })

        wrapper = mount(Demo, {
            global: {
                plugins: [store],
            },
        })
    })

    it('renders chat items correctly', () => {
        expect(wrapper.findAllComponents({ name: 't-chat-item' }).length).toBe(3)
    })

    it('toggles theme drawer on button click', async () => {
        await wrapper.find('.footer-btn button:first-child').trigger('click')
        expect(wrapper.vm.visible.theme).toBe(true)
        await wrapper.find('.footer-btn button:first-child').trigger('click')
        expect(wrapper.vm.visible.theme).toBe(false)
    })

    it('toggles history drawer on button click', async () => {
        await wrapper.find('.footer-btn button:last-child').trigger('click')
        expect(wrapper.vm.visible.history).toBe(true)
        await wrapper.find('.footer-btn button:last-child').trigger('click')
        expect(wrapper.vm.visible.history).toBe(false)
    })

    it('clears chat history on clear button click', async () => {
        await wrapper.findComponent({ name: 't-chat' }).vm.$emit('clear')
        expect(wrapper.vm.chatList.length).toBe(0)
    })

    it('handles input enter correctly', async () => {
        const input = wrapper.findComponent({ name: 't-chat-input' })
        await input.vm.$emit('send', 'Test message')
        expect(wrapper.vm.chatList.length).toBe(5)
        expect(wrapper.vm.chatList[1].content).toBe('Test message')
    })

    it('handles stop button click correctly', async () => {
        wrapper.vm.fetchCancel = { abort: vi.fn() }
        await wrapper.findComponent({ name: 't-chat-input' }).vm.$emit('stop')
        expect(wrapper.vm.fetchCancel.abort).toHaveBeenCalled()
        expect(wrapper.vm.loading).toBe(false)
        expect(wrapper.vm.isStreamLoad).toBe(false)
    })
})
