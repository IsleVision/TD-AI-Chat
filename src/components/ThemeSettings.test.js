import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import ThemeSettings from './ThemeSettings.vue'

describe('ThemeSettings.vue', () => {
    let store
    let wrapper
    let dispatchSpy

    beforeEach(() => {
        const storeOptions = {
            state: {
                theme: {
                    chatShowOptions: {
                        showAvatar: false,
                        showName: false,
                        showDateTime: false,
                    },
                    textStyle: 'text',
                },
            },
            mutations: {
                'theme/changeChatShowOptions': vi.fn(),
                'theme/changeTextStyle': vi.fn(),
            },
            actions: {
                'theme/changeChatShowOptions': vi.fn(),
                'theme/changeTextStyle': vi.fn(),
            },
        }

        store = createStore(storeOptions)
        dispatchSpy = vi.spyOn(store, 'dispatch')

        wrapper = mount(ThemeSettings, {
            global: {
                plugins: [store],
            },
        })
    })

    it('should render chat settings correctly', async () => {
        const wrapper = mount(ThemeSettings, {
            global: {
                plugins: [store],
            },
        })
        expect(wrapper.findAll('.tdesign-demo-block-row').length).toBe(3)
        expect(wrapper.text()).toContain('头像')
        expect(wrapper.text()).toContain('名字')
        expect(wrapper.text()).toContain('时间')
    })

    it('should update chatShowOptions and dispatch action when chat show options change', async () => {
        const switchElements = wrapper.findAllComponents({ name: 't-switch' })
        for (let i = 0; i < switchElements.length; i++) {
            await switchElements[i].trigger('click')
            const chatShowOptions = wrapper.vm.chatShowOptions
            expect(dispatchSpy).toHaveBeenCalledWith('theme/changeChatShowOptions', chatShowOptions)
        }
    })

    it('should update textStyle and dispatch action when text style changes', async () => {
        const textStyleOptions = wrapper.vm.textStyleOptions
        const radioGroup = wrapper.findAllComponents({ name: 't-radio' })
        for (let i = 1; i < radioGroup.length; i++) {
            await radioGroup[i].trigger('click')
            expect(dispatchSpy).toHaveBeenCalledWith(
                'theme/changeTextStyle',
                textStyleOptions[i].value,
            )
        }
    })
})
