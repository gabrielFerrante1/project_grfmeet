import { Button, useClipboard, useToast } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { LuClipboardCheck } from 'react-icons/lu'
import styles from './MeetingShare.module.scss'

export default () => {
    const [link, setLink] = useState('')

    const toast = useToast()
    const { onCopy, setValue } = useClipboard('');

    const handleCopy = () => {
        setValue(link)
        onCopy()

        toast({
            title: 'Link copiado com sucesso',
            isClosable: true,
            status: 'success',
            position: 'top',
            duration: 1000
        })
    }

    useEffect(() => {
        setLink(window.location.href)
    }, [])

    return (
        <div className={styles.container}>
            <div className={styles.shareLink}>
                {link}
            </div>

            <Button onClick={handleCopy} leftIcon={<LuClipboardCheck />} size='sm' colorScheme='blue' variant='outline'  >
                Copiar informações sobre como participar
            </Button>
        </div>
    )
}