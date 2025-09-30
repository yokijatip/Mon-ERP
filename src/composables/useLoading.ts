import { ref, computed } from 'vue'

export const useLoading = (initialState = false) => {
    const isLoading = ref(initialState)
    const progress = ref(0)
<<<<<<< HEAD

    const startLoading = () => {
        isLoading.value = true
        progress.value = 0

=======
    
    const startLoading = () => {
        isLoading.value = true
        progress.value = 0
        
>>>>>>> 21be25b26c919adbb0dcfd720be944bded451f22
        // Simulate progress
        const interval = setInterval(() => {
            if (progress.value < 90) {
                progress.value += Math.random() * 30
            }
        }, 200)
<<<<<<< HEAD

=======
        
>>>>>>> 21be25b26c919adbb0dcfd720be944bded451f22
        return () => {
            clearInterval(interval)
            progress.value = 100
            setTimeout(() => {
                isLoading.value = false
                progress.value = 0
            }, 300)
        }
    }
<<<<<<< HEAD

=======
    
>>>>>>> 21be25b26c919adbb0dcfd720be944bded451f22
    const stopLoading = () => {
        isLoading.value = false
        progress.value = 0
    }
<<<<<<< HEAD

=======
    
>>>>>>> 21be25b26c919adbb0dcfd720be944bded451f22
    const setLoading = (state: boolean) => {
        isLoading.value = state
        if (!state) {
            progress.value = 0
        }
    }
<<<<<<< HEAD

=======
    
>>>>>>> 21be25b26c919adbb0dcfd720be944bded451f22
    return {
        isLoading: computed(() => isLoading.value),
        progress: computed(() => progress.value),
        startLoading,
        stopLoading,
        setLoading
    }
}