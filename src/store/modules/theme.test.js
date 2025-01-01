import theme from './theme'

const mockState = {
    textStyle: 'text',
    chatShowOptions: {
        showAvatar: true,
        showName: true,
        showDateTime: true,
    },
}

const mockCommit = vi.fn()

describe('theme module', () => {
    beforeEach(() => {
        mockCommit.mockClear()
    })

    describe('mutations', () => {
        test('setTextStyle should update the textStyle state', () => {
            const mutation = theme.mutations.setTextStyle
            mutation(mockState, 'text')
            expect(mockState.textStyle).toBe('text')
        })

        test('setChatShowOptions should merge new options with existing ones', () => {
            const mutation = theme.mutations.setChatShowOptions
            mutation(mockState, { showAvatar: false })
            expect(mockState.chatShowOptions).toEqual({
                showAvatar: false,
                showName: true,
                showDateTime: true,
            })
        })
    })

    describe('actions', () => {
        test('changeTextStyle should commit setTextStyle mutation', () => {
            const action = theme.actions.changeTextStyle
            action({ commit: mockCommit }, 'text')
            expect(mockCommit).toHaveBeenCalledWith('setTextStyle', 'text')
        })

        test('changeChatShowOptions should commit setChatShowOptions mutation', () => {
            const action = theme.actions.changeChatShowOptions
            action({ commit: mockCommit }, { showName: false })
            expect(mockCommit).toHaveBeenCalledWith('setChatShowOptions', { showName: false })
        })
    })
})
