import { useToast } from '@/components/ui/toast/use-toast'
import { CircleAlert, CircleCheck, CircleX, Info } from 'lucide-vue-next';
import { h } from 'vue';

export function success(content: string) {
  const { toast } = useToast();
  toast({
    icon: h(CircleCheck),
    title: '成功',
    description: content,
    variant: 'success',
  });
}

export function warning(content: string) {
  const { toast } = useToast();
  toast({
    icon: h(CircleAlert),
    title: '警告',
    description: content,
    variant: 'warning',
  });
}

export function error(content: string) {
  const { toast } = useToast();
  toast({
    icon: h(CircleX),
    title: '错误',
    description: content,
    variant: 'destructive',
  });
}

export function info(content: string) {
  const { toast } = useToast();
  toast({
    icon: h(Info),
    title: '提示',
    description: content,
    variant: 'info',
  });
}
