import { ref, computed } from 'vue'

export const useLoading = (initialState = false) => {
    const isLoading = ref(initialState)
    const progress = ref(0)
    
    const startLoading = () => {
        isLoading.value = true
        progress.value = 0
        
        // Simulate progress
        const interval = setInterval(() => {
            if (progress.value < 90) {
                progress.value += Math.random() * 30
            }
        }, 200)
        
        return () => {
            clearInterval(interval)
            progress.value = 100
            setTimeout(() => {
                isLoading.value = false
                progress.value = 0
            }, 300)
        }
    }
    
    const stopLoading = () => {
        isLoading.value = false
        progress.value = 0
    }
    
    const setLoading = (state: boolean) => {
        isLoading.value = state
        if (!state) {
            progress.value = 0
        }
    }
    
    return {
        isLoading: computed(() => isLoading.value),
        progress: computed(() => progress.value),
        startLoading,
        stopLoading,
        setLoading
    }
}