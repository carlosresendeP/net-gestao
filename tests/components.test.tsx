import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/button';
import { SuccessCard } from '@/app/components/SuccessCard';

describe('Button Component', () => {
    it('deve renderizar o botão com texto correto', () => {
        render(<Button>Clique Aqui</Button>);
        expect(screen.getByText('Clique Aqui')).toBeInTheDocument();
    });

    it('deve chamar onClick quando clicado', async () => {
        const handleClick = vi.fn();
        const user = userEvent.setup();

        render(<Button onClick={handleClick}>Clique</Button>);

        const button = screen.getByText('Clique');
        await user.click(button);

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('deve estar desabilitado quando disabled=true', () => {
        render(<Button disabled>Desabilitado</Button>);

        const button = screen.getByText('Desabilitado');
        expect(button).toBeDisabled();
    });

    it('não deve chamar onClick quando desabilitado', async () => {
        const handleClick = vi.fn();
        const user = userEvent.setup();

        render(
            <Button onClick={handleClick} disabled>
                Desabilitado
            </Button>
        );

        const button = screen.getByText('Desabilitado');
        await user.click(button);

        expect(handleClick).not.toHaveBeenCalled();
    });
});

describe('SuccessCard Component', () => {
    it('deve renderizar o card de sucesso com título padrão', () => {
        render(<SuccessCard />);

        expect(screen.getByText('Obrigado por se inscrever!')).toBeInTheDocument();
        expect(
            screen.getByText('Sua intenção foi enviada com sucesso.')
        ).toBeInTheDocument();
    });

    it('deve renderizar o ícone de sucesso', () => {
        const { container } = render(<SuccessCard />);

        // Verifica se o ícone SVG está presente
        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
    });

    it('deve renderizar a mensagem de aguardar aprovação', () => {
        render(<SuccessCard />);

        expect(
            screen.getByText(/Aguarde a aprovação do administrador/i)
        ).toBeInTheDocument();
    });
});
