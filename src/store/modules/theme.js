export default {
    namespaced: true,
    state() {
        return {
            textStyle: 'text',
            chatShowOptions: {
                showAvatar: true,
                showName: true,
                showDateTime: true,
            },
        }
    },
    mutations: {
        setTextStyle(state, textStyle) {
            state.textStyle = textStyle
        },
        setChatShowOptions(state, chatShowOptions) {
            state.chatShowOptions = { ...state.chatShowOptions, ...chatShowOptions }
            console.log(state.chatShowOptions, chatShowOptions, 'chatShowOptions')
        },
    },
    actions: {
        changeTextStyle({ commit }, textStyle) {
            commit('setTextStyle', textStyle)
        },
        changeChatShowOptions({ commit }, chatShowOptions) {
            commit('setChatShowOptions', chatShowOptions)
        },
    },
}
