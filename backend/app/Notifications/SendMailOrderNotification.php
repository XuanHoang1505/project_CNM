<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SendMailOrderNotification extends Notification
{
    use Queueable;

    public $order;

    public function __construct($order)
    {
        $this->order = $order;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $customerName = $this->order->customer_info['fullName'] ?? 'Khách hàng';
        $orderItems = $this->order->items ?? [];
        
        return (new MailMessage)
            ->subject('✓ Xác nhận đơn hàng #' . $this->order->order_code . ' - SHOP.CO')
            ->view('emails.order-confirmation', [
                'order' => $this->order,
                'customerName' => $customerName,
                'orderItems' => $orderItems
            ]);
    }
}